#include "common.hpp" 

std::pair<uint8_t*, size_t> toCxx(Napi::Value& input) {
  std::pair<uint8_t*, size_t> res = std::make_pair<uint8_t*, size_t>(nullptr, 0);
  if (input.IsBuffer()) {
    js_buffer_t inputBuf = input.As<js_buffer_t>();
    res.second = inputBuf.Length();
    res.first = new uint8_t[res.second + 1];
    std::memcpy(res.first, inputBuf.Data(), res.second);
  }
  else if (input.IsTypedArray()) {
    Napi::TypedArray inputAr = input.As<Napi::TypedArray>();
    res.second = inputAr.ByteLength();
    res.first = new uint8_t[res.second + 1];
    std::memcpy(res.first, static_cast<uint8_t*>(inputAr.ArrayBuffer().Data()) + inputAr.ByteOffset(), res.second);
  }
  else {
    Napi::Error::New(input.Env(), "Invalid input type, expected either Buffer of TypedArray").ThrowAsJavaScriptException();
  }
  DEBUG_OUTPUT((std::stringstream{} << "size is " << res.second).str().c_str());
  return res;
}

std::pair<uint8_t*, size_t> toCxx(Napi::Value&& input) {
  return toCxx(input);
}
