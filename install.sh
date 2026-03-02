#!/usr/bin/env bash
#
# userctl installer
# Usage: curl -sL https://raw.githubusercontent.com/saharshpamecha/userctl/main/install.sh | bash
#

set -euo pipefail

REPO="saharshpamecha/userctl"
INSTALL_DIR="/usr/local/bin"
BINARY_NAME="userctl"
RAW_URL="https://raw.githubusercontent.com/${REPO}/main/cli/userctl"

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

echo -e "${CYAN}${BOLD}"
echo "  ╔══════════════════════════════════════════╗"
echo "  ║  userctl — Service Account Management    ║"
echo "  ║  Installer v1.0.0                        ║"
echo "  ╚══════════════════════════════════════════╝"
echo -e "${NC}"

# Check if running as root
if [[ $EUID -ne 0 ]]; then
    echo -e "${RED}[ERROR]${NC} This installer needs root privileges to copy to ${INSTALL_DIR}."
    echo -e "       Run with: ${BOLD}curl -sL ... | sudo bash${NC}"
    exit 1
fi

# Check for curl or wget
if command -v curl &>/dev/null; then
    DOWNLOADER="curl -sL"
elif command -v wget &>/dev/null; then
    DOWNLOADER="wget -qO-"
else
    echo -e "${RED}[ERROR]${NC} Neither curl nor wget found. Install one and retry."
    exit 1
fi

echo -e "${GREEN}[1/3]${NC} Downloading userctl from GitHub..."
$DOWNLOADER "$RAW_URL" > "/tmp/${BINARY_NAME}" || {
    echo -e "${RED}[ERROR]${NC} Download failed. Check your internet connection."
    exit 1
}

echo -e "${GREEN}[2/3]${NC} Installing to ${INSTALL_DIR}/${BINARY_NAME}..."
mv "/tmp/${BINARY_NAME}" "${INSTALL_DIR}/${BINARY_NAME}"
chmod +x "${INSTALL_DIR}/${BINARY_NAME}"

echo -e "${GREEN}[3/3]${NC} Verifying installation..."
if command -v userctl &>/dev/null; then
    echo
    userctl version
    echo
    echo -e "${GREEN}${BOLD}Installation complete!${NC}"
    echo -e "Run ${BOLD}userctl help${NC} to get started."
else
    echo -e "${RED}[ERROR]${NC} Installation verification failed."
    exit 1
fi
