#!/bin/sh
set -eu

OTW="$1"
WORKDIR="$(mktemp -d)"

"$OTW" --version
"$OTW" docs icmp | grep -q "icmp.ECHO_REQUEST"

cat > "$WORKDIR/script.mjs" <<'SCRIPT'
import otw, { icmp } from 'over-the-wire';

export const options = {
  supported_os: ['linux', 'mac'],
};

export default async function (wire, args) {
  const probe = wire.packet().ipv4({ src: '10.0.0.1', dst: args[0] }).icmp({ type: icmp.ECHO_REQUEST });
  const routes = await otw.system.getRoutingTable();

  console.log(`probe of ${probe.buffer.length} bytes for ${args[0]}, timeout ${args.timeout}, ${Object.keys(routes).length} routed interfaces`);
}
SCRIPT

"$OTW" "$WORKDIR/script.mjs" -- 8.8.8.8 -timeout 1000 | grep "probe of 36 bytes for 8.8.8.8, timeout 1000"
printf 'dns.PORT\n.exit\n' | "$OTW" | grep -q "53"

rm -rf "$WORKDIR"
echo "standalone otw works"
