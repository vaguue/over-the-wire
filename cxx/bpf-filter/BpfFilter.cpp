#include "BpfFilter.hpp"

namespace OverTheWire::BpfFilter {

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  BpfFilter::Init(env, exports);
  return exports;
}

Napi::Object BpfFilter::Init(Napi::Env env, Napi::Object exports) {
  Napi::Function func = DefineClass(env, "BpfFilter", {
    InstanceMethod<&BpfFilter::match>("match", static_cast<napi_property_attributes>(napi_writable | napi_configurable)),
    InstanceAccessor<&BpfFilter::getFilter, &BpfFilter::setFilter>("value"),
    InstanceAccessor<&BpfFilter::getLinkType, &BpfFilter::setLinkType>("linkType"),
  });

  env.GetInstanceData<AddonData>()->SetClass(typeid(BpfFilter), func);
  exports.Set("BpfFilter", func);
  return exports;
}

BpfFilter::BpfFilter(const Napi::CallbackInfo& info) : Napi::ObjectWrap<BpfFilter>{info}, obj{new pcpp::BpfFilterWrapper} {
  if (info.Length() > 0) {
    filter = info[0].As<Napi::String>().Utf8Value(); 
  }
  if (info.Length() > 1) {
    linkType = static_cast<decltype(linkType)>(info[1].As<Napi::Number>().Uint32Value());
  }

  if (filter.size() > 0) {
    if (!obj->setFilter(filter, linkType)) {
      Napi::Error::New(info.Env(), "Error setting filter").ThrowAsJavaScriptException();
    }
  }
}

BpfFilter::~BpfFilter() {}

Napi::Value BpfFilter::getFilter(const Napi::CallbackInfo& info) {
  return Napi::String::New(info.Env(), filter);
}

Napi::Value BpfFilter::getLinkType(const Napi::CallbackInfo& info) {
  return Napi::Number::New(info.Env(), linkType);
}

void BpfFilter::setFilter(const Napi::CallbackInfo& info, const Napi::Value& val) {
  filter = val.As<Napi::String>().Utf8Value();

  if (!obj->setFilter(filter, linkType)) {
    Napi::Error::New(info.Env(), "Error setting filter").ThrowAsJavaScriptException();
  }
}

void BpfFilter::setLinkType(const Napi::CallbackInfo&, const Napi::Value& val) {
  linkType = static_cast<decltype(linkType)>(val.As<Napi::Number>().Uint32Value());
}

Napi::Value BpfFilter::match(const Napi::CallbackInfo& info) {
  checkLength(info, 1);

  if (filter.size() == 0) {
    return Napi::Boolean::New(info.Env(), true);
  }

  DEBUG_OUTPUT(filter);

  js_buffer_t buf = info[0].As<js_buffer_t>();
  Napi::Array hrtime = info[1].As<Napi::Array>();
  struct timespec ts;
  if (info.Length() > 1) {
    ts.tv_sec = hrtime.Get("0").As<Napi::Number>().Uint32Value();
    ts.tv_nsec = hrtime.Get("1").As<Napi::Number>().Uint32Value();
  }
  else {
    timespec_get(&ts, TIME_UTC);
  }

  auto _linkType = linkType;
  if (info.Length() > 3) {
    _linkType = static_cast<decltype(linkType)>(info[2].As<Napi::Number>().Uint32Value());
  }

  return Napi::Boolean::New(info.Env(), obj->matchPacketWithFilter(buf.Data(), buf.Length(), ts, _linkType));
}

}
