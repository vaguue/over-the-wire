#include <cstdio>
#include <memory>
#include <string>
#include <string_view>
#include <vector>

#include <node.h>
#include <node_api.h>
#include <uv.h>

extern const char overTheWireBundle[];
extern const size_t overTheWireBundleLength;

extern "C" napi_value napi_register_module_v1(napi_env env, napi_value exports);

static const char* linkedBindingName = "over_the_wire";
static const int platformThreads = 4;

struct Runtime {
  std::unique_ptr<node::MultiIsolatePlatform> platform;

  Runtime() : platform{node::MultiIsolatePlatform::Create(platformThreads)} {
    v8::V8::InitializePlatform(platform.get());
    v8::V8::Initialize();
  }

  ~Runtime() {
    v8::V8::Dispose();
    v8::V8::DisposePlatform();
    node::TearDownOncePerProcess();
  }

  int run(const std::vector<std::string>& arguments) {
    std::vector<std::string> errors;
    std::vector<std::string> noExecArguments;
    std::unique_ptr<node::CommonEnvironmentSetup> setup = node::CommonEnvironmentSetup::Create(platform.get(), &errors, arguments, noExecArguments);

    if (!setup) {
      for (const std::string& error : errors) {
        fprintf(stderr, "otw: %s\n", error.c_str());
      }

      return 1;
    }

    v8::Isolate* isolate = setup->isolate();
    node::Environment* env = setup->env();
    int exitCode = 0;

    {
      v8::Locker locker(isolate);
      v8::Isolate::Scope isolateScope(isolate);
      v8::HandleScope handleScope(isolate);
      v8::Context::Scope contextScope(setup->context());

      napi_module binding = {
        NAPI_MODULE_VERSION,
        0,
        __FILE__,
        napi_register_module_v1,
        linkedBindingName,
        nullptr,
        {0},
      };

      node::AddLinkedBinding(env, binding);

      v8::MaybeLocal<v8::Value> loaded = node::LoadEnvironment(env, std::string_view(overTheWireBundle, overTheWireBundleLength));

      if (loaded.IsEmpty()) {
        return 1;
      }

      exitCode = node::SpinEventLoop(env).FromMaybe(1);
      node::Stop(env);
    }

    return exitCode;
  }
};

int main(int argc, char** argv) {
  argv = uv_setup_args(argc, argv);

  std::vector<std::string> arguments(argv, argv + argc);
  std::vector<std::string> onlyTheProgramName(arguments.begin(), arguments.begin() + 1);

  std::shared_ptr<node::InitializationResult> initialized = node::InitializeOncePerProcess(onlyTheProgramName, {
    node::ProcessInitializationFlags::kNoInitializeV8,
    node::ProcessInitializationFlags::kNoInitializeNodeV8Platform,
    node::ProcessInitializationFlags::kDisableNodeOptionsEnv,
    node::ProcessInitializationFlags::kNoPrintHelpOrVersionOutput,
  });

  for (const std::string& error : initialized->errors()) {
    fprintf(stderr, "otw: %s\n", error.c_str());
  }

  if (initialized->early_return() != 0) {
    return initialized->exit_code();
  }

  Runtime runtime;
  return runtime.run(arguments);
}
