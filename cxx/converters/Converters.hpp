#pragma once

#include "common.hpp"
#include "error/Error.hpp"
#include <uv.h>

/* 
 * Get ARP table for an interface
*/

namespace OverTheWire::Converters {

  Napi::Object Init(Napi::Env, Napi::Object);

  Napi::Value inetPton(const Napi::CallbackInfo&);
  Napi::Value inetNtop(const Napi::CallbackInfo&);

  Napi::Value jsHtonl(const Napi::CallbackInfo&);
  Napi::Value jsNtohl(const Napi::CallbackInfo&);
  Napi::Value jsHtons(const Napi::CallbackInfo&);
  Napi::Value jsNtohs(const Napi::CallbackInfo&);
}
