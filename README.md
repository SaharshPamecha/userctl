# userctl — Linux User & Service Account Management Toolkit

<p align="center">
  <strong>Audit. Provision. Restrict.</strong><br/>
  A production-grade CLI for managing Linux service accounts and enforcing least-privilege shell policies at scale.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#commands">Commands</a> •
  <a href="#interactive-demo">Demo</a> •
  <a href="#use-cases">Use Cases</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## Why userctl?

Every Linux server accumulates service accounts — backup agents, CI runners, monitoring daemons, legacy contractors. Over time:

- Service accounts get created with **interactive shells** (`/bin/bash`) instead of `/sbin/nologin`
- **Stale accounts** linger after decommissioning
- **Compliance auditors** ask for proof of least-privilege enforcement
- There's **no lightweight tool** to declaratively manage user state across a fleet

`userctl` solves all of this in a single, dependency-free Bash script.

## Features

| Command | What It Does |
|---------|-------------|
| `userctl audit` | Scan accounts, flag service users with interactive shells. Output as table/JSON/CSV. |
| `userctl apply -f users.yaml` | Declaratively provision users from YAML config. Idempotent. |
| `userctl diff -f users.yaml` | Preview what would change before applying. |
| `userctl restrict` | Find and auto-fix service accounts with interactive shells. |
| `userctl report` | Generate compliance reports (SOC2/ISO friendly). |

### Key Highlights

- **Zero dependencies** — pure Bash, works on any Linux distro
- **Declarative YAML config** — define desired state, version-control it
- **Dry-run mode** — preview all changes before applying
- **Multiple output formats** — table, JSON, CSV for CI/CD integration
- **Idempotent** — run 100 times, same result
- **Production-grade** — proper error handling, colored output, comprehensive help

## Quick Start

### Option 1 — Quick Install

```bash
curl -sL https://raw.githubusercontent.com/saharshpamecha/userctl/main/install.sh | bash
```

### Option 2 — Manual

```bash
git clone https://github.com/saharshpamecha/userctl.git
chmod +x userctl/cli/userctl
sudo cp userctl/cli/userctl /usr/local/bin/
```

### Verify

```bash
userctl version
# userctl version 1.0.0
```

## Commands

### Audit

```bash
# Audit all accounts (including system)
userctl audit --all

# Show only flagged accounts (security concerns)
userctl audit --flagged

# Filter by shell type
userctl audit --shell nologin

# JSON output for CI pipelines
userctl audit --format json

# CSV export
userctl audit --format csv > audit-report.csv
```

### Provision (Apply)

Define your users in YAML:

```yaml
# users.yaml
- username: kirsty
  shell: /sbin/nologin
  groups: backup,monitoring
  state: present
  comment: Backup service agent

- username: deploy-bot
  shell: /bin/false
  groups: docker,deploy
  state: present

- username: old-contractor
  state: absent
```

Then apply:

```bash
# Preview changes first
userctl diff -f users.yaml

# Apply configuration
sudo userctl apply -f users.yaml
```

### Restrict

```bash
# Scan for violations
userctl restrict

# Auto-fix all violations
sudo userctl restrict --auto

# Exclude specific accounts
sudo userctl restrict --auto --exclude root,daemon

# Use /bin/false instead of /sbin/nologin
sudo userctl restrict --auto --shell /bin/false
```

### Report

```bash
# Print compliance report
userctl report

# Save to file
userctl report -o compliance-report.txt
```

## Interactive Demo

Try userctl directly in your browser — no install needed:

**[Launch Interactive Demo →](https://userctl.vercel.app)**

The web simulator lets you run all userctl commands against a simulated `/etc/passwd` database.

## Use Cases

### CI/CD Pipeline Gate
```bash
# In your CI pipeline
FLAGGED=$(userctl audit --flagged --format json | wc -l)
if [ "$FLAGGED" -gt 0 ]; then
  echo "FAIL: Service accounts with interactive shells detected"
  exit 1
fi
```

### Fleet Hardening with SSH
```bash
# Apply to all servers
for server in $(cat servers.txt); do
  ssh admin@$server 'sudo userctl restrict --auto'
done
```

### Ansible Integration
```yaml
- name: Deploy userctl
  copy:
    src: userctl
    dest: /usr/local/bin/userctl
    mode: '0755'

- name: Apply user config
  command: userctl apply -f /etc/userctl/users.yaml
```

### Pre-Audit Compliance Check
```bash
userctl report -o /var/log/userctl-compliance-$(date +%Y%m%d).txt
```

## Project Structure

```
day-01/
├── cli/
│   └── userctl              # The CLI tool (Bash)
├── web/                     # Interactive web demo (Next.js)
│   ├── app/
│   │   ├── components/
│   │   │   └── Terminal.tsx  # Terminal simulator
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx          # Landing page
│   └── package.json
├── examples/
│   └── users.yaml           # Example config
├── docs/
├── install.sh               # Quick installer
└── README.md
```

## /sbin/nologin vs /bin/false — Quick Reference

| Aspect | `/sbin/nologin` | `/bin/false` |
|--------|----------------|-------------|
| **Purpose** | Purpose-built for denying login | Generic "return false" |
| **Feedback** | Prints "This account is currently not available." | Silent exit |
| **Audit trail** | Better — clear message in logs | Minimal |
| **Modern standard** | Preferred for service accounts | Legacy fallback |
| **PAM support** | Full PAM integration | None |

## Contributing

Contributions welcome! This is Day 1 of a 100-day open-source DevOps series.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Ideas for Contributions

- LDAP/Active Directory integration
- AWS IAM user sync
- Kubernetes ServiceAccount auditing
- Terraform provider
- Prometheus metrics exporter
- Web dashboard for fleet-wide view

## License

MIT License — see [LICENSE](LICENSE) for details.

## Author

**Saharsh Pamecha** — Staff Engineer | DevOps • Data • AI

- X: [@SaharshPamecha1](https://x.com/SaharshPamecha1)
- GitHub: [saharshpamecha](https://github.com/saharshpamecha)

Part of the [#100DaysOfDevOps](https://kodekloud.com/100-days-of-devops) challenge — Day 1.
