"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface TerminalLine {
  type: "input" | "output" | "error" | "success" | "info" | "header" | "divider";
  text: string;
}

const SIMULATED_PASSWD: string[] = [
  "root:x:0:0:root:/root:/bin/bash",
  "daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin",
  "bin:x:2:2:bin:/bin:/usr/sbin/nologin",
  "sys:x:3:3:sys:/dev:/usr/sbin/nologin",
  "sync:x:4:65534:sync:/bin:/bin/sync",
  "games:x:5:60:games:/usr/games:/usr/sbin/nologin",
  "man:x:6:12:man:/var/cache/man:/usr/sbin/nologin",
  "lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin",
  "mail:x:8:8:mail:/var/mail:/usr/sbin/nologin",
  "news:x:9:9:news:/var/spool/news:/usr/sbin/nologin",
  "www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin",
  "backup:x:34:34:backup:/var/backups:/bin/bash",
  "nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin",
  "sshd:x:100:65534::/run/sshd:/usr/sbin/nologin",
  "tony:x:1000:1000:Tony Stark:/home/tony:/bin/bash",
  "steve:x:1001:1001:Steve Rogers:/home/steve:/bin/bash",
  "kirsty:x:1002:1002::/home/kirsty:/sbin/nologin",
  "deploy-bot:x:1003:1003:CI/CD Runner:/home/deploy-bot:/bin/false",
  "prometheus:x:998:998:Prometheus Agent:/opt/prometheus:/usr/sbin/nologin",
  "mysql:x:27:27:MySQL Server:/var/lib/mysql:/bin/bash",
  "nginx:x:33:33:nginx:/var/cache/nginx:/sbin/nologin",
];

let dynamicUsers: string[] = [];

const NON_INTERACTIVE = ["/sbin/nologin", "/usr/sbin/nologin", "/bin/false"];
const INTERACTIVE = ["/bin/bash", "/bin/sh", "/bin/zsh", "/bin/fish"];

function parsePasswd(line: string) {
  const parts = line.split(":");
  return {
    username: parts[0],
    uid: parseInt(parts[2]),
    gid: parseInt(parts[3]),
    comment: parts[4],
    home: parts[5],
    shell: parts[6],
  };
}

function getAllUsers() {
  return [...SIMULATED_PASSWD, ...dynamicUsers];
}

function processCommand(input: string): TerminalLine[] {
  const trimmed = input.trim();
  const lines: TerminalLine[] = [];

  if (!trimmed) return lines;

  const parts = trimmed.split(/\s+/);

  if (parts[0] === "userctl") {
    const command = parts[1];
    const args = parts.slice(2);

    switch (command) {
      case "audit":
        return handleAudit(args);
      case "apply":
        return handleApply(args);
      case "diff":
        return handleDiff(args);
      case "restrict":
        return handleRestrict(args);
      case "report":
        return handleReport();
      case "help":
      case "--help":
      case "-h":
        return handleHelp();
      case "version":
      case "--version":
      case "-v":
        return [{ type: "output", text: "userctl version 1.0.0" }, { type: "output", text: "Linux User & Service Account Management Toolkit" }];
      default:
        return [{ type: "error", text: `[ERROR] Unknown command: ${command}` }, { type: "info", text: "Run 'userctl help' for usage." }];
    }
  }

  if (parts[0] === "clear") {
    return [{ type: "header", text: "__CLEAR__" }];
  }

  if (parts[0] === "help") {
    return [
      { type: "info", text: "Available commands:" },
      { type: "output", text: "  userctl audit [--all] [--flagged] [--system] [--shell <filter>] [--format json|csv]" },
      { type: "output", text: "  userctl apply -f users.yaml [--dry-run]" },
      { type: "output", text: "  userctl diff -f users.yaml" },
      { type: "output", text: "  userctl restrict [--auto]" },
      { type: "output", text: "  userctl report" },
      { type: "output", text: "  userctl help | version" },
      { type: "output", text: "  clear  — Clear terminal" },
      { type: "output", text: "  cat /etc/passwd  — View user database" },
      { type: "output", text: "  grep <term> /etc/passwd  — Search users" },
    ];
  }

  if (trimmed === "cat /etc/passwd") {
    return getAllUsers().map((l) => ({ type: "output" as const, text: l }));
  }

  if (trimmed.startsWith("grep") && trimmed.includes("/etc/passwd")) {
    const match = trimmed.match(/grep\s+(\S+)\s+\/etc\/passwd/);
    if (match) {
      const term = match[1];
      const results = getAllUsers().filter((l) => l.includes(term));
      if (results.length === 0) return [{ type: "info", text: "(no matches)" }];
      return results.map((l) => ({ type: "output" as const, text: l }));
    }
  }

  return [{ type: "error", text: `command not found: ${parts[0]}` }, { type: "info", text: "Type 'help' for available commands." }];
}

function handleAudit(args: string[]): TerminalLine[] {
  const lines: TerminalLine[] = [];
  const showAll = args.includes("--all") || args.includes("-a");
  const showSystem = args.includes("--system");
  const flaggedOnly = args.includes("--flagged");
  const shellIdx = args.indexOf("--shell") !== -1 ? args.indexOf("--shell") : args.indexOf("-s");
  const shellFilter = shellIdx !== -1 ? args[shellIdx + 1] || "" : "";
  const formatIdx = args.indexOf("--format") !== -1 ? args.indexOf("--format") : args.indexOf("-f");
  const format = formatIdx !== -1 ? args[formatIdx + 1] || "table" : "table";

  const now = new Date().toLocaleString();
  lines.push({ type: "header", text: "═══ Service Account Audit Report ═══" });
  lines.push({ type: "info", text: `Generated: ${now}` });
  lines.push({ type: "info", text: "Host: simulator.userctl.dev" });
  lines.push({ type: "info", text: "Passwd file: /etc/passwd (simulated)\n" });

  let total = 0, nonInteractive = 0, flagged = 0, noHome = 0;
  const rows: { username: string; uid: number; gid: number; shell: string; status: string; statusType: string }[] = [];

  for (const line of getAllUsers()) {
    const u = parsePasswd(line);
    if (!showAll && !showSystem && u.uid < 1000) continue;
    if (!showAll && showSystem && u.uid >= 1000) continue;
    if (shellFilter && !u.shell.includes(shellFilter)) continue;

    total++;
    let status = "OK";
    let statusType = "success";

    if (NON_INTERACTIVE.includes(u.shell)) {
      nonInteractive++;
      status = "RESTRICTED";
      statusType = "success";
    } else if (INTERACTIVE.includes(u.shell)) {
      if (u.uid < 1000) {
        flagged++;
        status = "⚠ FLAGGED";
        statusType = "error";
      } else {
        status = "ACTIVE";
        statusType = "info";
      }
    } else {
      status = "UNKNOWN";
      statusType = "info";
    }

    if (flaggedOnly && !status.includes("FLAGGED")) continue;
    rows.push({ username: u.username, uid: u.uid, gid: u.gid, shell: u.shell, status, statusType });
  }

  if (format === "json") {
    for (const r of rows) {
      lines.push({ type: "output", text: JSON.stringify({ username: r.username, uid: r.uid, shell: r.shell, status: r.status }) });
    }
    return lines;
  }

  if (format === "csv") {
    lines.push({ type: "output", text: "username,uid,gid,shell,status" });
    for (const r of rows) {
      lines.push({ type: "output", text: `${r.username},${r.uid},${r.gid},${r.shell},${r.status}` });
    }
    return lines;
  }

  lines.push({ type: "output", text: `${"USERNAME".padEnd(18)} ${"UID".padEnd(7)} ${"GID".padEnd(7)} ${"SHELL".padEnd(24)} STATUS` });
  lines.push({ type: "divider", text: "─".repeat(75) });

  for (const r of rows) {
    lines.push({
      type: r.statusType as TerminalLine["type"],
      text: `${r.username.padEnd(18)} ${String(r.uid).padEnd(7)} ${String(r.gid).padEnd(7)} ${r.shell.padEnd(24)} ${r.status}`,
    });
  }

  lines.push({ type: "divider", text: "─".repeat(75) });
  lines.push({ type: "header", text: "═══ Summary ═══" });
  lines.push({ type: "output", text: `  Total accounts scanned:     ${total}` });
  lines.push({ type: "success", text: `  Non-interactive (secure):   ${nonInteractive}` });
  lines.push({ type: "error", text: `  Flagged (review needed):    ${flagged}` });

  if (flagged > 0) {
    lines.push({ type: "info", text: "" });
    lines.push({ type: "error", text: `[WARN] Found ${flagged} service account(s) with interactive shells.` });
    lines.push({ type: "info", text: "Run 'userctl restrict --auto' to enforce non-interactive shells." });
  } else {
    lines.push({ type: "success", text: "\n[OK] All service accounts have appropriate shell restrictions." });
  }

  return lines;
}

function handleApply(args: string[]): TerminalLine[] {
  const lines: TerminalLine[] = [];
  const dryRun = args.includes("--dry-run");
  const fileIdx = args.indexOf("-f") !== -1 ? args.indexOf("-f") : args.indexOf("--file");

  if (fileIdx === -1) {
    return [{ type: "error", text: "[ERROR] Config file required. Use -f <file.yaml>" }];
  }

  const fileName = args[fileIdx + 1] || "users.yaml";

  lines.push({ type: "header", text: `═══ User Provisioning — ${fileName} ═══` });
  if (dryRun) {
    lines.push({ type: "info", text: "[DRY RUN] No changes will be made.\n" });
  }

  const mockUsers = [
    { name: "kirsty", shell: "/sbin/nologin", groups: "backup,monitoring", exists: true, currentShell: "/sbin/nologin" },
    { name: "deploy-bot", shell: "/bin/false", groups: "docker,deploy", exists: true, currentShell: "/bin/false" },
    { name: "prometheus-agent", shell: "/sbin/nologin", groups: "monitoring", exists: false, currentShell: "" },
    { name: "logrotate-svc", shell: "/usr/sbin/nologin", groups: "", exists: false, currentShell: "" },
    { name: "old-contractor", shell: "", groups: "", exists: false, currentShell: "", state: "absent" },
  ];

  let created = 0, skipped = 0;

  for (const u of mockUsers) {
    if ((u as { state?: string }).state === "absent") {
      if (u.exists) {
        lines.push(dryRun
          ? { type: "info", text: `[DRY RUN] Would remove user: ${u.name}` }
          : { type: "success", text: `[OK] Removed user: ${u.name}` });
      } else {
        lines.push({ type: "info", text: `[INFO] User ${u.name} already absent. Skipping.` });
        skipped++;
      }
      continue;
    }
    if (u.exists && u.currentShell === u.shell) {
      lines.push({ type: "info", text: `[INFO] User ${u.name} already configured correctly. Skipping.` });
      skipped++;
    } else if (u.exists) {
      lines.push(dryRun
        ? { type: "info", text: `[DRY RUN] Would update ${u.name} shell: ${u.currentShell} → ${u.shell}` }
        : { type: "success", text: `[OK] Updated ${u.name} shell → ${u.shell}` });
      created++;
    } else {
      if (!dryRun) {
        dynamicUsers.push(`${u.name}:x:${1010 + created}:${1010 + created}::/home/${u.name}:${u.shell}`);
      }
      lines.push(dryRun
        ? { type: "info", text: `[DRY RUN] Would create user: useradd -s ${u.shell}${u.groups ? ` -G ${u.groups}` : ""} ${u.name}` }
        : { type: "success", text: `[OK] Created user: ${u.name} (shell: ${u.shell})` });
      created++;
    }
  }

  lines.push({ type: "header", text: "═══ Provisioning Summary ═══" });
  lines.push({ type: "success", text: `  Created/Updated:  ${created}` });
  lines.push({ type: "info", text: `  Skipped:          ${skipped}` });
  lines.push({ type: "output", text: `  Errors:           0` });

  return lines;
}

function handleDiff(args: string[]): TerminalLine[] {
  const newArgs = [...args];
  if (!newArgs.includes("--dry-run")) newArgs.push("--dry-run");
  return handleApply(newArgs);
}

function handleRestrict(args: string[]): TerminalLine[] {
  const lines: TerminalLine[] = [];
  const auto = args.includes("--auto");

  lines.push({ type: "header", text: "═══ Shell Restriction Enforcement ═══" });

  let flagged = 0, fixed = 0;

  for (const line of getAllUsers()) {
    const u = parsePasswd(line);
    if (u.uid >= 1000) continue;
    if (u.username === "root") continue;
    if (INTERACTIVE.includes(u.shell)) {
      flagged++;
      if (auto) {
        fixed++;
        lines.push({ type: "success", text: `[OK] Restricted ${u.username}: ${u.shell} → /sbin/nologin` });
      } else {
        lines.push({ type: "error", text: `[WARN] FLAGGED: ${u.username} (UID: ${u.uid}) has interactive shell: ${u.shell}` });
      }
    }
  }

  lines.push({ type: "output", text: "" });
  if (flagged === 0) {
    lines.push({ type: "success", text: "[OK] No service accounts with interactive shells found. System is clean." });
  } else if (!auto) {
    lines.push({ type: "info", text: `[WARN] Found ${flagged} service account(s) with interactive shells.` });
    lines.push({ type: "info", text: "Run 'sudo userctl restrict --auto' to enforce restrictions." });
  } else {
    lines.push({ type: "header", text: "═══ Restriction Summary ═══" });
    lines.push({ type: "info", text: `  Flagged:  ${flagged}` });
    lines.push({ type: "success", text: `  Fixed:    ${fixed}` });
    lines.push({ type: "output", text: `  Failed:   ${flagged - fixed}` });
  }

  return lines;
}

function handleReport(): TerminalLine[] {
  const lines: TerminalLine[] = [];
  let total = 0, service = 0, regular = 0, nologin = 0, flagged = 0;

  for (const line of getAllUsers()) {
    const u = parsePasswd(line);
    total++;
    if (u.uid < 1000) {
      service++;
      if (INTERACTIVE.includes(u.shell) && u.username !== "root") flagged++;
    } else {
      regular++;
    }
    if (NON_INTERACTIVE.includes(u.shell)) nologin++;
  }

  lines.push({ type: "divider", text: "═══════════════════════════════════════════════" });
  lines.push({ type: "header", text: "  USERCTL COMPLIANCE REPORT" });
  lines.push({ type: "info", text: `  Generated: ${new Date().toLocaleString()}` });
  lines.push({ type: "info", text: "  Hostname:  simulator.userctl.dev" });
  lines.push({ type: "divider", text: "═══════════════════════════════════════════════" });
  lines.push({ type: "output", text: "" });
  lines.push({ type: "output", text: "ACCOUNT OVERVIEW" });
  lines.push({ type: "output", text: `  Total accounts:             ${total}` });
  lines.push({ type: "output", text: `  System/Service (UID<1000):   ${service}` });
  lines.push({ type: "output", text: `  Regular users (UID≥1000):    ${regular}` });
  lines.push({ type: "output", text: `  Non-interactive shells:      ${nologin}` });
  lines.push({ type: "output", text: "" });
  lines.push({ type: "output", text: "SECURITY FINDINGS" });

  if (flagged > 0) {
    lines.push({ type: "error", text: `  ⚠ CRITICAL: ${flagged} service account(s) have interactive shells` });
    lines.push({ type: "info", text: "  Recommendation: Run 'sudo userctl restrict --auto'" });
  } else {
    lines.push({ type: "success", text: "  ✓ All service accounts have non-interactive shells" });
  }

  lines.push({ type: "output", text: "" });
  lines.push({ type: "output", text: "COMPLIANCE STATUS" });
  lines.push(flagged === 0
    ? { type: "success", text: "  Status: COMPLIANT ✓" }
    : { type: "error", text: "  Status: NON-COMPLIANT ✗" });

  return lines;
}

function handleHelp(): TerminalLine[] {
  return [
    { type: "header", text: "userctl — Linux User & Service Account Management Toolkit v1.0.0" },
    { type: "output", text: "" },
    { type: "output", text: "USAGE" },
    { type: "output", text: "  userctl <command> [options]" },
    { type: "output", text: "" },
    { type: "output", text: "COMMANDS" },
    { type: "success", text: "  audit       Audit service accounts and shell configurations" },
    { type: "success", text: "  apply       Provision users declaratively from YAML config" },
    { type: "success", text: "  diff        Preview changes before applying (dry-run)" },
    { type: "success", text: "  restrict    Enforce non-interactive shells on service accounts" },
    { type: "success", text: "  report      Generate compliance report" },
    { type: "output", text: "" },
    { type: "output", text: "EXAMPLES" },
    { type: "info", text: "  userctl audit --all                  Full audit" },
    { type: "info", text: "  userctl audit --flagged               Security concerns only" },
    { type: "info", text: "  userctl apply -f users.yaml           Provision users" },
    { type: "info", text: "  userctl diff -f users.yaml            Preview changes" },
    { type: "info", text: "  userctl restrict --auto               Auto-fix violations" },
    { type: "info", text: "  userctl report                        Compliance report" },
  ];
}

function colorForType(type: TerminalLine["type"]): string {
  switch (type) {
    case "input": return "text-[#06d6a0]";
    case "success": return "text-[#06d6a0]";
    case "error": return "text-[#f43f5e]";
    case "info": return "text-[#f59e0b]";
    case "header": return "text-[#818cf8] font-bold";
    case "divider": return "text-[#2a3352]";
    default: return "text-[#94a3b8]";
  }
}

const DEMO_COMMANDS = [
  "userctl audit --all",
  "userctl audit --flagged",
  "userctl restrict",
  "userctl diff -f users.yaml",
  "userctl apply -f users.yaml",
  "userctl report",
  "grep nologin /etc/passwd",
];

export default function Terminal() {
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: "header", text: "userctl v1.0.0 — Interactive Simulator" },
    { type: "info", text: "Type 'help' for available commands or try the quick-action buttons below.\n" },
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [history, scrollToBottom]);

  const executeCommand = useCallback((cmd: string) => {
    const result = processCommand(cmd);

    if (result.length === 1 && result[0].text === "__CLEAR__") {
      setHistory([]);
      setInput("");
      return;
    }

    setHistory((prev) => [
      ...prev,
      { type: "input", text: `$ ${cmd}` },
      ...result,
      { type: "output", text: "" },
    ]);

    if (cmd.trim()) {
      setCmdHistory((prev) => [cmd, ...prev]);
    }
    setInput("");
    setHistoryIndex(-1);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < cmdHistory.length - 1) {
        const newIdx = historyIndex + 1;
        setHistoryIndex(newIdx);
        setInput(cmdHistory[newIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIdx = historyIndex - 1;
        setHistoryIndex(newIdx);
        setInput(cmdHistory[newIdx]);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Terminal window */}
      <div className="rounded-xl overflow-hidden border border-[#2a3352] glow-cyan">
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#131829] border-b border-[#2a3352]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#f43f5e]" />
            <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
            <div className="w-3 h-3 rounded-full bg-[#06d6a0]" />
          </div>
          <span className="text-xs text-[#64748b] font-mono">root@simulator:~</span>
          <div className="w-16" />
        </div>

        {/* Terminal body */}
        <div
          ref={terminalRef}
          className="bg-[#0b0e17] p-4 h-[420px] overflow-y-auto cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((line, i) => (
            <div key={i} className={`terminal-line ${colorForType(line.type)}`}>
              {line.text}
            </div>
          ))}

          {/* Input line */}
          <div className="flex items-center terminal-line">
            <span className="text-[#06d6a0] mr-2">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-[#e2e8f0] font-mono text-[13px] caret-[#06d6a0]"
              spellCheck={false}
              autoFocus
            />
            <span className="cursor-blink text-[#06d6a0] ml-0.5">▌</span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-[#131829] border-t border-[#2a3352] px-4 py-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase tracking-wider text-[#64748b] mr-1">Quick:</span>
            {DEMO_COMMANDS.map((cmd) => (
              <button
                key={cmd}
                onClick={() => executeCommand(cmd)}
                className="px-2.5 py-1 text-[11px] font-mono rounded-md bg-[#1e2640] text-[#94a3b8] border border-[#2a3352] hover:border-[#06d6a0] hover:text-[#06d6a0] transition-all duration-200 cursor-pointer"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
