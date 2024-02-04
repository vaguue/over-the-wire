#pragma once

#include <iostream>
#include "common.hpp"

/* First module in this project for testing purposes. 
 * I think I'll keep it.
 */

namespace OverTheWire::Example {
  Napi::Object Init(Napi::Env env, Napi::Object exports);

  Napi::Value da(const Napi::CallbackInfo&);
}
