#pragma once

#include "common.hpp"
#include "PacketUtils.h"

/*
 * Checksum helpers
*/

namespace OverTheWire::Checksums {
  Napi::Object Init(Napi::Env env, Napi::Object exports);

  Napi::Value IPChecksum(const Napi::CallbackInfo&);
}
