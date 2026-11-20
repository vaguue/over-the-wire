#!/bin/sh
set -eu

REPOSITORY="vaguue/over-the-wire"
RELEASES="${OVER_THE_WIRE_RELEASES:-https://github.com/$REPOSITORY/releases/latest/download}"
INSTALL_DIR="${OVER_THE_WIRE_INSTALL_DIR:-$HOME/.local/bin}"

fail() {
  echo "[!] $1" >&2
  exit 1
}

case "$(uname -s)" in
  Linux) system="linux" ;;
  Darwin) system="macos" ;;
  CYGWIN* | MINGW* | MSYS* | Windows_NT) fail "On Windows, download otw-windows-x64.exe from $RELEASES and install Npcap (https://npcap.com) for capture. Or, with Node.js: npm install --global over-the-wire" ;;
  *) fail "There is no standalone otw for $(uname -s). With Node.js installed: npm install --global over-the-wire" ;;
esac

case "$(uname -m)" in
  x86_64 | amd64) arch="x64" ;;
  arm64 | aarch64) arch="arm64" ;;
  *) fail "There is no standalone otw for $(uname -m). With Node.js installed: npm install --global over-the-wire" ;;
esac

if [ "$system" = "linux" ] && ldd --version 2>&1 | grep -qi musl; then
  fail "The standalone otw needs glibc, this system uses musl. With Node.js installed: npm install --global over-the-wire"
fi

asset="otw-$system-$arch"
downloaded="$INSTALL_DIR/otw.download"

echo "[*] Installing over-the-wire for $system $arch"

mkdir -p "$INSTALL_DIR"
curl -sSfL "$RELEASES/$asset" -o "$downloaded" || fail "Could not download $RELEASES/$asset"
chmod +x "$downloaded"

if ! version="$("$downloaded" --version 2> /dev/null)"; then
  rm -f "$downloaded"
  fail "What was downloaded from $RELEASES/$asset does not run on this system"
fi

mv "$downloaded" "$INSTALL_DIR/otw"

echo "[*] otw $version is installed in $INSTALL_DIR"

case ":$PATH:" in
  *":$INSTALL_DIR:"*) ;;
  *) echo "[*] $INSTALL_DIR is not in PATH. Add it: export PATH=\"$INSTALL_DIR:\$PATH\"" ;;
esac

echo "[*] Capturing and sending packets needs the privileges tcpdump needs: run otw with sudo for that"
