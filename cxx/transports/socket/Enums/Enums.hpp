#pragma once

#include "common.hpp"

/* This module is supposed to export some 
 * system constants, just by putting them in the exports.
 * So we can do something new socket.Socket(socket.AF_INET, socket.SOCK_STREAM);
 * Sounds very simple, but again, differences between operating systems are hilarious.
 */

namespace OverTheWire::Transports::Socket::Enums {

  Napi::Object Init(Napi::Env env, Napi::Object exports);

}
