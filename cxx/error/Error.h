#pragma once

#include <uv.h>

#include "common.h"

/* Painlessly retrive the last error.
 */

namespace OverTheWire {

std::string getSystemError();
std::string getLibuvError(int);

}
