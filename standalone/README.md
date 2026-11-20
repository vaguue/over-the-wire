# The standalone binary

`otw` as one executable: Node.js, the native part of over-the-wire and the JavaScript of the library and its command line, linked together through the [Node.js embedding API](https://nodejs.org/api/embedding.html).

- `main.cxx` starts Node.js, registers the native part as a linked binding and runs the bundled script.
- `scripts/standalone-bundle.js` bundles `standalone/entry.js` with esbuild and writes it as a C++ source. Two modules are replaced on the way: `lib/bindings.js` by `standalone/bindings.js` (the linked binding instead of a `.node` file) and `lib/cli/host.js` by `standalone/host.js` (the package inside the binary instead of the one in `node_modules`, and self-update).
- `libnode.sh` builds Node.js from source as static libraries. This takes from half an hour to two hours and is cached in CI.

## Building

For a release, with Node.js inside:

```bash
standalone/libnode.sh "$PWD/libnode"
npm run standalone-bundle
cmake -S standalone -B build-standalone/cmake -DNODE_SOURCE_DIR="$(ls -d "$PWD"/libnode/node-v*)"
cmake --build build-standalone/cmake
sh standalone/smoke.sh build-standalone/cmake/otw
```

On Linux `Dockerfile.standalone` does all of it on glibc 2.28 with libpcap inside, then checks that the result runs on a system without Node.js:

```bash
docker buildx build -f Dockerfile.standalone . --output standalone-release
```

While working on it, linking against a shared libnode is much faster, for example the one Homebrew installs:

```bash
npm run standalone-bundle
cmake -S standalone -B build-standalone/cmake \
  "-DNODE_INCLUDE_DIR=/opt/homebrew/include/node;/opt/homebrew/include" \
  "-DNODE_LIBRARY=/opt/homebrew/lib/libnode.127.dylib;/opt/homebrew/lib/libuv.dylib"
cmake --build build-standalone/cmake
```

`test/standalone.test.js` runs its standalone tests against `build-standalone/cmake/otw`, or the path in `OVER_THE_WIRE_STANDALONE`, and skips them when there is no binary.

## Recipes

A script run by the binary (or by `otw <file>` in general) is a function of the wire. The wire, the protocol namespaces and `docs()` are already in scope, so a recipe is just the function, named after the file, with no import and no `otw()`:

```javascript
function arping(wire, args) {
  const target = args[0];
  const request = wire.packet().ethernet().arp({ opcode: arp.WHO_HAS, protocolDst: target });
  wire.s(request).ex(wire.f.arp({ opcode: arp.IS_AT, protocolSrc: target })).then(console.log);
}

arping.options = { supported_os: ['linux', 'mac'] };
```

`otw arping.js 192.168.1.1` runs `arping(wire, args)`. `args` carries the positionals and `--name value` options. `arping.options.supported_os` lists the systems it runs on; on another one the binary stops with a message. The older form, `export default function (wire, args)` with `export const options`, still works, and a plain top-level script (`const wire = otw(); ...`) still runs as before.

## Windows

The pcap dependency is never redistributed inside the binary. On Windows it is [Npcap](https://npcap.com), which the user installs themselves (as Wireshark requires), and the binary links it dynamically through `wpcap.dll` at runtime — the same way PcapPlusPlus links it everywhere else. So there is no license reason to withhold a Windows build, and `otw-windows-x64.exe` is a normal target: build it against the Npcap SDK and a Windows Node.js library, exactly like the macOS build but with MSVC. Capture needs Npcap present at runtime; reading and writing capture files and crafting packets do not.
