#trigger rebuild
FROM node:22.14.0-alpine3.21 AS build
RUN sed -i 's/https/http/' /etc/apk/repositories
RUN apk add --no-cache \
  bison \
  bluez-dev \
  cmake \
  curl \
  flex \
  g++ \
  jq \
  less \
  linux-headers \
  make \
  tshark \
  xz
COPY scripts/static-libpcap.sh /tmp/static-libpcap.sh
RUN /tmp/static-libpcap.sh /opt/libpcap
ENV CMAKE_PREFIX_PATH=/opt/libpcap
ENV OVER_THE_WIRE_PORTABLE=1
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN CMAKE_BUILD_PARALLEL_LEVEL=$(nproc) npm run precompile
RUN npm test
RUN ! ldd build/Release/over-the-wire.node | grep -E 'libpcap|libstdc\+\+|libgcc'

FROM node:18-alpine3.17 AS alpine317
COPY --from=build /app /app
RUN cd /app && npm test > /loads.log 2>&1 || (tail -n 60 /loads.log && false)

FROM node:24-alpine AS alpinelatest
COPY --from=build /app /app
RUN cd /app && npm test > /loads.log 2>&1 || (tail -n 60 /loads.log && false)

FROM build AS verified
COPY --from=alpine317 /loads.log /checks/alpine317.log
COPY --from=alpinelatest /loads.log /checks/alpinelatest.log

FROM scratch
COPY --from=verified /app/prebuilds/ .
