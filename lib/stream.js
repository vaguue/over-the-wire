const { Duplex } = require('stream');

class AsyncDuplexStream extends Duplex {
  constructor(options) {
    // Убедитесь, что объектный режим включен
    super({ ...options, objectMode: true });
  }

  _read(size) {
    // Здесь может быть логика для чтения данных
    // Например, имитация асинхронного получения данных
    setTimeout(() => {
      const data = { value: Math.random() };
      this.push(data); // Отправка данных в поток
    }, 100);
  }

  _write(chunk, encoding, callback) {
    // Асинхронная обработка записываемых данных
    setTimeout(() => {
      console.log('Asynchronously writing:', chunk);
      callback(); // Завершение обработки чанка
    }, 100);
  }

  _final(callback) {
    console.log('No more data to write.');
    callback();
  }
}
