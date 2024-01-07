#pragma once

#include <iostream>
#include "common.hpp"
#include "stdlib.h"
#include "PcapLiveDeviceList.h"
#include "IpUtils.h"
#include "SystemUtils.h"
#include "pcap.h"

/* Wrapper around PcapPlusPlus BpfFilterWrapper.
 * Wrapper around wrapper.
*/

namespace OverTheWire::BpfFilter {
  Napi::Object Init(Napi::Env env, Napi::Object exports);

  struct BpfFilter : public Napi::ObjectWrap<BpfFilter> {
    static Napi::Object Init(Napi::Env, Napi::Object);
    BpfFilter(const Napi::CallbackInfo& info);
    ~BpfFilter();

    Napi::Value getFilter(const Napi::CallbackInfo&);
    void setFilter(const Napi::CallbackInfo&, const Napi::Value&);

    Napi::Value getLinkType(const Napi::CallbackInfo&);
    void setLinkType(const Napi::CallbackInfo&, const Napi::Value&);

    Napi::Value match(const Napi::CallbackInfo&);

    std::unique_ptr<pcpp::BpfFilterWrapper> obj;
    std::string filter = "";
    pcpp::LinkLayerType linkType = pcpp::LinkLayerType::LINKTYPE_ETHERNET;
  };
}
