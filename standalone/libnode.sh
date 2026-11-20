#!/bin/sh
set -eu

NODE_VERSION=22.23.2
NODE_SHA256=bbe768df8d5815d7fa76124052985332452e0a4742d39f32027550d1aab8f6fb
DESTINATION="${1:-$PWD/libnode}"
JOBS="${JOBS:-$(getconf _NPROCESSORS_ONLN)}"
ARCHIVE="node-v$NODE_VERSION.tar.xz"

mkdir -p "$DESTINATION"
cd "$DESTINATION"

if [ ! -f "node-v$NODE_VERSION/out/Release/node" ]; then
  curl -sSfLO "https://nodejs.org/dist/v$NODE_VERSION/$ARCHIVE"

  if command -v sha256sum > /dev/null; then
    echo "$NODE_SHA256  $ARCHIVE" | sha256sum -c -
  else
    echo "$NODE_SHA256  $ARCHIVE" | shasum -a 256 -c -
  fi

  tar -xJf "$ARCHIVE"
  rm "$ARCHIVE"

  cd "node-v$NODE_VERSION"
  ./configure --enable-static --without-npm --without-corepack --with-intl=small-icu
  make -j"$JOBS"
fi

echo "$DESTINATION/node-v$NODE_VERSION"
