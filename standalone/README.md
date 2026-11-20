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
