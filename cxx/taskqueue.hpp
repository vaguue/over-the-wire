#include <queue>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <functional>

template<typename Task>
struct TaskQueue {
  void Push(Task task) {
    std::lock_guard<std::mutex> lock(mutex);
    tasks.push(task);
    cond.notify_one();
  }

  Task Pop() {
    std::unique_lock<std::mutex> lock(mutex);
    cond.wait(lock, [this]{ return !tasks.empty(); });
    Task task = tasks.front();
    tasks.pop();
    return task;
  }

  bool Empty() {
    std::lock_guard<std::mutex> lock(mutex);
    return tasks.empty();
  }

  std::queue<Task> tasks;
  std::mutex mutex;
  std::condition_variable cond;
};

template<typename Task>
struct Worker {
  Worker(Napi::Env env, Napi::ThreadSafeFunction onError)
  : env{env}, tq{}, onError{onError} {
    worker = std::thread(&Worker::Run, this);
  }

  ~Worker() {
    if (worker.joinable()) {
      worker.join();
    }
  }

  void Push(Task task) {
    tq.push(task);
  }

  void Run() {
    while (true) {
      try {
        Task task = tq.Pop();
        if (!task) break;
        task();
      } catch (const std::exception& e) {
        auto status = onError.BlockingCall([e](Napi::Env env, Napi::Function jsCallback) {
          jsCallback.Call({Napi::String::New(env, e.what())});
        });
        if (status != napi_ok) {
          break;
        }
      }
    }
  }

  void Stop() {
    tq.Push(Task{nullptr});
  }

  Napi::Env env;
  TaskQueue<Task> tq;
  Napi::ThreadSafeFunction onError;
  std::thread worker;
};

