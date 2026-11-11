#pragma once

#include <uv.h>

#include <cstddef>
#include <cstdint>
#include <functional>
#include <memory>
#include <vector>

#include "Sys.h"
#include "Address.h"

namespace OverTheWire::Transports::Socket {

  struct OutgoingPacket {
    std::unique_ptr<uint8_t[]> data;
    size_t size = 0;
    Address destination;
  };

  struct SendResult {
    int systemError = 0;
    size_t bytesSent = 0;
  };

  struct IncomingPacket {
    std::unique_ptr<uint8_t[]> data;
    size_t size = 0;
    Address source;
  };

  struct ReceivedBatch {
    std::vector<IncomingPacket> packets;
    int systemError = 0;
  };

  struct BackendOptions {
    size_t receiveBufferSize = 65'535;
    size_t maxPacketsPerReceive = 32;
    int sendFlags = 0;
  };

  using every_packet_settled_t = std::function<void(std::vector<SendResult>&& resultPerPacketInSubmissionOrder)>;
  using batch_received_t = std::function<void(ReceivedBatch&& batch)>;
  using closed_t = std::function<void()>;

  struct Backend {
    virtual ~Backend() = default;

    virtual int attach(uv_loop_t* loop, SOCKET socket, const BackendOptions& options) = 0;

    virtual void send(std::vector<OutgoingPacket>&& batch, every_packet_settled_t onEveryPacketSettled) = 0;

    virtual int startReceiving(batch_received_t onBatchReceived) = 0;
    virtual void stopReceiving() = 0;

    virtual void close(closed_t onClosed) = 0;
  };

  std::unique_ptr<Backend> createBackendForThisPlatform();

}
