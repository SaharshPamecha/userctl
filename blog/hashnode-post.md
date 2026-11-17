# Refreshing Linux Service Account Fundamentals: Non-Interactive Shell Best Practices

Probably this is my first deep-dive blog post! I have always been mostly spending my time as a spectator in the DevOps space — keenly following, learning, internalizing... but never really had the guts to put my own work out there, document my thinking, and share it publicly.

Today, I dare to come out and write this. I know not many would read it, but trust me, this is for me — to read, internalize, and let it sink in. Also, I am excited and a little fearful to start this journey of learning and building in public. Let's see how this turns out.

---

## The Problem We Don't Talk About Enough

Every Linux server I have worked on — from early-career VMs to production fleets — accumulates service accounts. Backup agents, CI runners, monitoring daemons, legacy contractor accounts. Over months and years, they pile up.

And here is the uncomfortable truth: **most of these service accounts end up with interactive shells when they absolutely should not have them.**

I have seen it everywhere:
- A backup agent created with `/bin/bash` because "we might need to troubleshoot"
- A monitoring daemon with a login shell because the previous admin "wanted easy access"
- Stale contractor accounts lingering with `/bin/sh` months after offboarding

This is not just messy. It is a security gap that compliance auditors (and attackers) will find.

---

## Why /sbin/nologin Matters

When you create a service account, the shell assignment is your enforcement mechanism. A non-interactive shell ensures the account can run processes, access files, and perform its function — but **it can never be used for human login**.

| Shell | Purpose | Audit Trail |
|-------|---------|-------------|
| `/sbin/nologin` | Purpose-built for denying login | Logs "This account is currently not available" |
| `/usr/sbin/nologin` | Same (distro-specific path) | Same as above |
| `/bin/false` | Generic "return false" | Silent exit, minimal logging |

I default to `/sbin/nologin` (or `/usr/sbin/nologin` on Debian/Ubuntu) because:
- **Clear intent**: It is purpose-built, not repurposed
- **Better logging**: Generates an explicit denial message
- **PAM integration**: Works with access control policies
- **Modern standard**: RHEL, CentOS, and modern distros use this

The difference matters when you are proving least-privilege enforcement to an auditor.

---

## What I Built: userctl

I spent the last few days building **userctl** — a lightweight, dependency-free Bash toolkit for managing service accounts declaratively. It combines three operations I find myself doing repeatedly:

1. **Audit**: Scan the fleet, flag accounts with interactive shells
2. **Provision**: Define desired state in YAML, apply idempotently
3. **Restrict**: Auto-enforce `/sbin/nologin` on service accounts

The entire tool is one Bash script. No dependencies. Works on any Linux distro.

---

## A Real-World Example

Here is a pattern I use for CI/CD service accounts:

```yaml
# users.yaml
- username: deploy-bot
  shell: /bin/false
  groups: docker,deploy
  state: present
  comment: CI/CD deployment runner

- username: prometheus-agent
  shell: /sbin/nologin
  groups: monitoring
  state: present

- username: old-contractor
  state: absent
```

Preview changes:
```bash
userctl diff -f users.yaml
```

Apply when ready:
```bash
sudo userctl apply -f users.yaml
```

Audit the results:
```bash
userctl audit --flagged
```

If you want to auto-fix violations across your fleet:
```bash
sudo userctl restrict --auto
```

---

## Production Considerations

From my experience hardening Linux environments, here is what I have learned:

**1. Immutable Infrastructure Does Not Mean Ignoring Users**
Even if you run containers, the host OS has service accounts. Kubernetes node exporters, containerd, kubelet — they all run as users. Audit them.

**2. CI/CD Integration**
Run `userctl audit --format json` in your pipeline. Fail builds if service accounts have interactive shells. Shift left on compliance.

**3. Document Your Exceptions**
Sometimes you genuinely need a service account with shell access (rare, but happens). Document it. Version-control the exception. Do not let it become invisible debt.

**4. Combine With Your Existing Tools**
userctl is intentionally lightweight. Pipe it into Ansible. Wrap it in SSH loops for fleet operations. Export JSON for your SIEM.

---

## Interactive Demo

I built a web-based terminal simulator so you can try userctl without installing anything:

**[Try userctl in your browser →](https://userctl.vercel.app)**

The simulator runs all userctl commands against a simulated `/etc/passwd` database. Click the quick-action buttons or type commands directly.

---

## Open Source

userctl is open-source and available on GitHub:

**[github.com/SaharshPamecha/userctl](https://github.com/SaharshPamecha/userctl)**

Install it in 10 seconds:
```bash
curl -sL https://raw.githubusercontent.com/SaharshPamecha/userctl/main/install.sh | bash
```

I would love contributions — LDAP integration, Kubernetes ServiceAccount auditing, Terraform provider, Prometheus exporter. If this tool solves a problem for you, consider opening an issue or PR.

---

## Why I Am Doing This

As a Staff Engineer, I refresh fundamentals regularly. It keeps muscle memory sharp. Building tools like userctl, documenting my thinking, and sharing it publicly — this is how I internalize what I already know while contributing something useful back.

This is not about being a beginner. It is about being deliberate. Every senior engineer I respect does this. They revisit basics, automate repetitive work, and write it down so others do not have to rediscover it.

I am excited to share this journey. I am also a little fearful — putting work out there means critique, visibility, accountability. But that is the point. Growth happens at the edge of comfort.

---

## Who Am I?

**Saharsh Pamecha** — Staff Engineer. I work across DevOps, Data, and AI infrastructure. Building in public to sharpen my own understanding and hopefully help a few others along the way.

- **X**: [@SaharshPamecha1](https://x.com/SaharshPamecha1)
- **LinkedIn**: [Saharsh Pamecha](https://www.linkedin.com/in/saharsh-pamecha-6219961b7/)
- **GitHub**: [SaharshPamecha](https://github.com/SaharshPamecha)

If you are working on similar problems — service account hygiene, Linux hardening, fleet compliance — I would love to connect. Drop a comment or reach out directly.

---

## Tags
#Linux #DevOps #SysAdmin #ServiceAccounts #Security #Compliance #OpenSource #Infrastructure

---

*This post was written as part of my personal learning journey. The tool, the thinking, and the mistakes are all mine.*
