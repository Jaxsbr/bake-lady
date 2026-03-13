#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────────────────────────────────────
# Bake Lady — Install Script
# For Mac users. Run this once to set up the app on your computer.
# ─────────────────────────────────────────────────────────────────────────────

DEST_DIR="$HOME/Bake Lady"
DEST_FILE="$DEST_DIR/index.html"

# Work from the directory this script lives in
cd "$(dirname "$0")"

echo ""
echo "  Welcome to Bake Lady!"
echo "  This script will get the app ready on your Mac."
echo ""

# ── Step 1: Homebrew ─────────────────────────────────────────────────────────
if command -v brew &>/dev/null; then
  echo "  [1/5] Homebrew is already installed. Good."
else
  echo "  [1/5] Homebrew (a Mac helper tool) is not installed yet."
  echo "        We need it to install Node.js."
  echo ""
  read -r -p "        May we install Homebrew now? Type yes and press Enter: " REPLY
  echo ""
  if [[ "$REPLY" != "yes" && "$REPLY" != "y" ]]; then
    echo "  Installation cancelled. Homebrew is needed — please run this script again when ready."
    exit 1
  fi
  echo "  Installing Homebrew — this may take a few minutes. Please wait..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  # Add Homebrew to PATH (needed on Apple Silicon Macs)
  if [[ -f /opt/homebrew/bin/brew ]]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
  fi
  echo "  Homebrew installed."
fi

echo ""

# ── Step 2: Node.js ──────────────────────────────────────────────────────────
if command -v node &>/dev/null; then
  echo "  [2/5] Node.js is already installed ($(node --version)). Good."
else
  echo "  [2/5] Installing Node.js — this may take a minute..."
  brew install node
  echo "  Node.js installed ($(node --version))."
fi

echo ""

# ── Step 3: Install app dependencies ─────────────────────────────────────────
echo "  [3/5] Setting up app files..."
npm install --silent
echo "        Done."

echo ""

# ── Step 4: Build the app ────────────────────────────────────────────────────
echo "  [4/5] Building Bake Lady..."
npm run build --silent
echo "        Done."

echo ""

# ── Step 5: Copy to home folder and open ─────────────────────────────────────
echo "  [5/5] Saving the app to your home folder..."
mkdir -p "$DEST_DIR"
cp dist/index.html "$DEST_FILE"
echo "        Saved to: $DEST_FILE"
echo ""
echo "  Opening Bake Lady in your browser now..."
open "$DEST_FILE"

echo ""
echo "  ─────────────────────────────────────────────────────────────────"
echo "  All done! Bake Lady is open in your browser."
echo ""
echo "  Your recipes are saved privately on this Mac."
echo "  Nothing is sent to the internet."
echo ""
echo "  To open Bake Lady again in future:"
echo "  1. Open Finder"
echo "  2. Go to your home folder (the one with your name)"
echo "  3. Open the 'Bake Lady' folder"
echo "  4. Double-click index.html"
echo "  ─────────────────────────────────────────────────────────────────"
echo ""
