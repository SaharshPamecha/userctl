# Day 1 — Linux User Setup with Non-Interactive Shell

## KodeKloud Challenge

**Task**: Create a user named `kirsty` with a non-interactive shell on App Server 1 (Nautilus Infrastructure).

## Infrastructure

| Component | Host | User | Password |
|-----------|------|------|----------|
| Jump Host | jump_host | thor | mjolnir123 |
| App Server 1 | stapp01.stratos.xfusioncorp.com | tony | Ir0nM@n |

## Solution Walkthrough

### 1. SSH to App Server 1

```bash
ssh tony@stapp01.stratos.xfusioncorp.com
```

### 2. Create user with non-interactive shell

```bash
sudo useradd -s /sbin/nologin kirsty
```

### 3. Verify

```bash
grep kirsty /etc/passwd
# kirsty:x:1002:1002::/home/kirsty:/sbin/nologin
```

### 4. Test restriction

```bash
sudo su - kirsty
# Output: "This account is currently not available."
```

## Key Concepts

### Non-Interactive Shells

Service accounts (backup agents, CI runners, monitoring daemons) need system access but should never allow human login. Assigning a non-interactive shell enforces this.

| Shell | Purpose | Feedback | Best For |
|-------|---------|----------|----------|
| `/sbin/nologin` | Purpose-built login denial | Prints polite message | Modern standard |
| `/usr/sbin/nologin` | Same (different distro path) | Same | Debian/Ubuntu |
| `/bin/false` | Generic false return | Silent | Legacy systems |

### Why /sbin/nologin > /bin/false

- **Audit trail**: Generates clear log entry ("This account is currently not available")
- **PAM integration**: Works with PAM for access control
- **Intent clarity**: Purpose-built vs. repurposed utility
- **Standard practice**: RHEL, CentOS, modern distros default to this

### /etc/passwd Format

```
kirsty:x:1002:1002::/home/kirsty:/sbin/nologin
│      │ │    │    │ │            └─ Login shell
│      │ │    │    │ └────────────── Home directory
│      │ │    │    └──────────────── GECOS (comment)
│      │ │    └───────────────────── GID
│      │ └────────────────────────── UID
│      └──────────────────────────── Password (x = in /etc/shadow)
└─────────────────────────────────── Username
```

### Commands Used

| Command | Purpose |
|---------|---------|
| `ssh user@host` | Secure remote connection |
| `sudo useradd -s <shell> <user>` | Create user with specific shell |
| `grep <user> /etc/passwd` | Verify user creation |
| `sudo su - <user>` | Switch user (test restriction) |

## Mini-Project Built

**userctl** — Linux User & Service Account Management Toolkit

Combines three tools into one:
1. **Service Account Auditor** — Scan and flag misconfigured accounts
2. **User Provisioner CLI** — Declarative YAML-based user management
3. **Shell Restrictor** — Auto-enforce non-interactive shells on service accounts

[Full project details in the main README](../README.md)
