import { FilterBuilder } from '#lib/filter';

const DEFAULT_TIMEOUT_MS = 1000;
const MAX_UNEXAMINED_PACKETS = 4096;

const toPredicate = (filter) => {
  if (filter === undefined || filter === null) {
    return () => true;
  }

  if (typeof filter == 'function') {
    return filter;
  }

  const described = FilterBuilder.from(filter);

  return (packet) => {
    return described.matches(packet);
  };
};

const installExpect = (Stream) => {
  Stream.prototype.watch = function() {
    if (this.unexamined !== undefined) {
      return this;
    }

    this.unexamined = [];
    this.expectation = null;

    this.on('data', (packet) => {
      this.unexamined.push(packet);

      if (this.unexamined.length > MAX_UNEXAMINED_PACKETS) {
        this.unexamined.shift();

        if (this.expectation !== null && this.expectation.examinedCount > 0) {
          this.expectation.examinedCount--;
        }
      }

      this.settleExpectation();
    });

    return this;
  };

  Stream.prototype.settleExpectation = function() {
    const expectation = this.expectation;

    if (expectation === null) {
      return;
    }

    while (expectation.examinedCount < this.unexamined.length) {
      const packet = this.unexamined[expectation.examinedCount];
      expectation.examinedCount++;

      if (expectation.matches(packet)) {
        this.unexamined.splice(0, expectation.examinedCount);
        clearTimeout(expectation.timer);
        this.expectation = null;
        expectation.resolve(packet);
        return;
      }
    }
  };

  Stream.prototype.expect = function(filter, { timeout = DEFAULT_TIMEOUT_MS } = {}) {
    if (this.expectation !== undefined && this.expectation !== null) {
      return Promise.reject(new Error('Another expect() is still waiting on this stream'));
    }

    this.watch();

    return new Promise((resolve) => {
      const expectation = {
        matches: toPredicate(filter),
        examinedCount: 0,
        resolve,
        timer: null,
      };

      expectation.timer = setTimeout(() => {
        if (this.expectation === expectation) {
          this.expectation = null;
        }
        resolve(null);
      }, timeout);

      this.expectation = expectation;
      this.settleExpectation();
    });
  };

  return Stream;
};

export { installExpect };
export default { installExpect };
