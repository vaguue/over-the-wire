#!/bin/sh
set -eu

LIBPCAP_VERSION=1.10.7
LIBPCAP_SHA256=68fa62cffb974f4275641ce14c2e2d75739251f30e00e6a0900903b247d76a03
PREFIX="${1:-/opt/libpcap}"
WORKDIR="$(mktemp -d)"

cd "$WORKDIR"
curl -sSfLO "https://www.tcpdump.org/release/libpcap-$LIBPCAP_VERSION.tar.xz"
echo "$LIBPCAP_SHA256  libpcap-$LIBPCAP_VERSION.tar.xz" | sha256sum -c -
tar -xJf "libpcap-$LIBPCAP_VERSION.tar.xz"
cd "libpcap-$LIBPCAP_VERSION"

CFLAGS="-O2 -fPIC" ./configure \
  --prefix="$PREFIX" \
  --disable-shared \
  --without-libnl \
  --disable-dbus \
  --disable-rdma \
  --disable-usb \
  --disable-netmap

make -j"$(nproc)"
make install

cd /
rm -rf "$WORKDIR"
