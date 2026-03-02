"use client";

import dynamic from "next/dynamic";
import {
  Shield,
  Terminal as TerminalIcon,
  Users,
  FileSearch,
  Lock,
  FileText,
  Github,
  ChevronRight,
  Zap,
  Eye,
  BookOpen,
} from "lucide-react";

const Terminal = dynamic(() => import("./components/Terminal"), { ssr: false });

const features = [
  {
    icon: FileSearch,
    title: "Audit",
    desc: "Scan all accounts. Flag service users with interactive shells. JSON/CSV/table output for CI pipelines.",
    cmd: "userctl audit --all",
    color: "#06d6a0",
  },
  {
    icon: Users,
    title: "Provision",
    desc: "Declare users in YAML. Apply state across servers. Create, update, or remove — idempotent, every time.",
    cmd: "userctl apply -f users.yaml",
    color: "#3b82f6",
  },
  {
    icon: Lock,
    title: "Restrict",
    desc: "Auto-enforce /sbin/nologin on service accounts. One command to harden your entire fleet.",
    cmd: "userctl restrict --auto",
    color: "#f43f5e",
  },
  {
    icon: FileText,
    title: "Report",
    desc: "Generate compliance reports. SOC2-friendly. Exportable. Know your posture before the auditor does.",
    cmd: "userctl report",
    color: "#f59e0b",
  },
];

const useCases = [
  {
    title: "CI/CD Pipelines",
    desc: "Run userctl audit --format json in your pipeline. Fail the build if service accounts have interactive shells.",
  },
  {
    title: "Fleet Hardening",
    desc: "Combine with Ansible or SSH loops. One YAML config, consistent state across 500+ servers.",
  },
  {
    title: "Compliance Audits",
    desc: "Generate reports before SOC2/ISO audits. Prove least-privilege shell policy enforcement.",
  },
  {
    title: "Onboarding/Offboarding",
    desc: "Declarative user lifecycle. Add to YAML on join, set state: absent on exit. Version-controlled.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b0e17] bg-grid">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0b0e17]/80 backdrop-blur-xl border-b border-[#2a3352]">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#06d6a0] to-[#3b82f6] flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#0b0e17]" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              user<span className="text-[#06d6a0]">ctl</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#94a3b8]">
            <a href="#features" className="hover:text-[#06d6a0] transition-colors">Features</a>
            <a href="#demo" className="hover:text-[#06d6a0] transition-colors">Try It</a>
            <a href="#use-cases" className="hover:text-[#06d6a0] transition-colors">Use Cases</a>
            <a href="#install" className="hover:text-[#06d6a0] transition-colors">Install</a>
          </div>
          <a
            href="https://github.com/saharshpamecha/userctl"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1e2640] border border-[#2a3352] text-sm text-[#94a3b8] hover:border-[#06d6a0] hover:text-[#06d6a0] transition-all"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#06d6a0]/5 rounded-full blur-[120px]" />
          <div className="absolute top-40 right-1/4 w-80 h-80 bg-[#3b82f6]/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#06d6a0]/10 border border-[#06d6a0]/20 text-[#06d6a0] text-xs font-medium mb-8">
            <Zap className="w-3 h-3" />
            Open Source — Linux Security Toolkit
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="text-white">user</span>
            <span className="text-[#06d6a0] glow-text-cyan">ctl</span>
          </h1>

          <p className="text-xl md:text-2xl text-[#94a3b8] max-w-2xl mx-auto mb-4 leading-relaxed">
            Audit. Provision. Restrict.
          </p>
          <p className="text-base text-[#64748b] max-w-xl mx-auto mb-10">
            A production-grade CLI toolkit for managing Linux service accounts
            and enforcing least-privilege shell policies at scale.
          </p>

          {/* Install command */}
          <div className="inline-flex items-center gap-3 bg-[#131829] border border-[#2a3352] rounded-xl px-6 py-3 mb-10">
            <span className="text-[#06d6a0] font-mono text-sm">$</span>
            <code className="font-mono text-sm text-[#e2e8f0]">
              curl -sL https://raw.githubusercontent.com/saharshpamecha/userctl/main/install.sh | bash
            </code>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#demo"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#06d6a0] text-[#0b0e17] font-semibold text-sm hover:bg-[#05c493] transition-colors"
            >
              <TerminalIcon className="w-4 h-4" />
              Try Interactive Demo
            </a>
            <a
              href="https://github.com/saharshpamecha/userctl"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#2a3352] text-[#94a3b8] font-semibold text-sm hover:border-[#06d6a0] hover:text-[#06d6a0] transition-all"
            >
              <BookOpen className="w-4 h-4" />
              Read Docs
              <ChevronRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              One tool. Complete control.
            </h2>
            <p className="text-[#64748b] max-w-lg mx-auto">
              Everything you need to manage service accounts across your Linux infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group relative p-6 rounded-xl bg-[#131829] border border-[#2a3352] hover:border-[#2a3352]/0 transition-all duration-300"
              >
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${f.color}08, transparent 60%)`,
                    border: `1px solid ${f.color}30`,
                    borderRadius: "0.75rem",
                  }}
                />
                <div className="relative">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${f.color}15` }}
                  >
                    <f.icon className="w-5 h-5" style={{ color: f.color }} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-[#94a3b8] mb-4 leading-relaxed">{f.desc}</p>
                  <code className="text-xs font-mono px-3 py-1.5 rounded-md bg-[#0b0e17] text-[#64748b] border border-[#2a3352]">
                    {f.cmd}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section id="demo" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#f59e0b] text-xs font-medium mb-4">
              <Eye className="w-3 h-3" />
              Live Simulation
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Try it right here
            </h2>
            <p className="text-[#64748b] max-w-lg mx-auto">
              Full interactive simulation — type commands or click the quick-action buttons.
              No install needed.
            </p>
          </div>
          <Terminal />
        </div>
      </section>

      {/* YAML Config Example */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Declarative. Version-controlled.
              </h2>
              <p className="text-[#94a3b8] mb-6 leading-relaxed">
                Define your desired user state in a simple YAML file. Preview
                changes with <code className="text-[#06d6a0]">diff</code>,
                then apply with confidence. Git-friendly, auditor-friendly.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#06d6a0]/15 flex items-center justify-center mt-0.5 shrink-0">
                    <ChevronRight className="w-3 h-3 text-[#06d6a0]" />
                  </div>
                  <span className="text-[#94a3b8]">Idempotent — run it 100 times, same result</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#06d6a0]/15 flex items-center justify-center mt-0.5 shrink-0">
                    <ChevronRight className="w-3 h-3 text-[#06d6a0]" />
                  </div>
                  <span className="text-[#94a3b8]">Dry-run mode to preview before applying</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#06d6a0]/15 flex items-center justify-center mt-0.5 shrink-0">
                    <ChevronRight className="w-3 h-3 text-[#06d6a0]" />
                  </div>
                  <span className="text-[#94a3b8]">Supports present/absent lifecycle states</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-[#2a3352] bg-[#131829]">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#2a3352]">
                <div className="w-3 h-3 rounded-full bg-[#f43f5e]" />
                <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                <div className="w-3 h-3 rounded-full bg-[#06d6a0]" />
                <span className="ml-3 text-xs text-[#64748b] font-mono">users.yaml</span>
              </div>
              <pre className="p-5 text-[13px] font-mono leading-relaxed overflow-x-auto">
                <code>
                  <span className="text-[#64748b]"># Declarative user config</span>{"\n"}
                  <span className="text-[#f43f5e]">- username:</span> <span className="text-[#06d6a0]">kirsty</span>{"\n"}
                  {"  "}<span className="text-[#f43f5e]">shell:</span> <span className="text-[#94a3b8]">/sbin/nologin</span>{"\n"}
                  {"  "}<span className="text-[#f43f5e]">groups:</span> <span className="text-[#94a3b8]">backup,monitoring</span>{"\n"}
                  {"  "}<span className="text-[#f43f5e]">state:</span> <span className="text-[#3b82f6]">present</span>{"\n"}
                  {"\n"}
                  <span className="text-[#f43f5e]">- username:</span> <span className="text-[#06d6a0]">deploy-bot</span>{"\n"}
                  {"  "}<span className="text-[#f43f5e]">shell:</span> <span className="text-[#94a3b8]">/bin/false</span>{"\n"}
                  {"  "}<span className="text-[#f43f5e]">groups:</span> <span className="text-[#94a3b8]">docker,deploy</span>{"\n"}
                  {"  "}<span className="text-[#f43f5e]">state:</span> <span className="text-[#3b82f6]">present</span>{"\n"}
                  {"\n"}
                  <span className="text-[#f43f5e]">- username:</span> <span className="text-[#06d6a0]">old-contractor</span>{"\n"}
                  {"  "}<span className="text-[#f43f5e]">state:</span> <span className="text-[#f59e0b]">absent</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Built for real workflows
            </h2>
            <p className="text-[#64748b] max-w-lg mx-auto">
              From CI pipelines to compliance audits — userctl fits into your existing stack.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {useCases.map((uc) => (
              <div
                key={uc.title}
                className="p-5 rounded-xl bg-[#131829]/50 border border-[#2a3352] hover:bg-[#131829] transition-colors"
              >
                <h3 className="text-base font-semibold text-white mb-2">{uc.title}</h3>
                <p className="text-sm text-[#94a3b8] leading-relaxed">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Install */}
      <section id="install" className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get started in 10 seconds
          </h2>
          <p className="text-[#64748b] mb-10">
            Single-file Bash script. No dependencies. Works on any Linux distro.
          </p>

          <div className="space-y-4 text-left">
            <div className="rounded-xl bg-[#131829] border border-[#2a3352] p-5">
              <p className="text-xs text-[#64748b] mb-3 font-mono uppercase tracking-wider">Option 1 — Quick install</p>
              <code className="font-mono text-sm text-[#e2e8f0]">
                <span className="text-[#06d6a0]">$</span> curl -sL https://raw.githubusercontent.com/saharshpamecha/userctl/main/install.sh | bash
              </code>
            </div>
            <div className="rounded-xl bg-[#131829] border border-[#2a3352] p-5">
              <p className="text-xs text-[#64748b] mb-3 font-mono uppercase tracking-wider">Option 2 — Manual</p>
              <div className="font-mono text-sm text-[#e2e8f0] space-y-1">
                <p><span className="text-[#06d6a0]">$</span> git clone https://github.com/saharshpamecha/userctl.git</p>
                <p><span className="text-[#06d6a0]">$</span> chmod +x userctl/cli/userctl</p>
                <p><span className="text-[#06d6a0]">$</span> sudo cp userctl/cli/userctl /usr/local/bin/</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2a3352] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#06d6a0] to-[#3b82f6] flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-[#0b0e17]" />
            </div>
            <span className="text-sm text-[#64748b]">
              userctl — Built by{" "}
              <a
                href="https://x.com/SaharshPamecha1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#94a3b8] hover:text-[#06d6a0] transition-colors"
              >
                Saharsh Pamecha
              </a>
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[#64748b]">
            <a
              href="https://www.linkedin.com/in/saharsh-pamecha-6219961b7/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#06d6a0] transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/SaharshPamecha/userctl"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#06d6a0] transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
