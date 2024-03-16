const { getArpTable: getArpTableCxx } = require('./bindings');

module.exports = {
  async getArpTable() {
    return new Promise((resolve, reject) => {
      getArpTableCxx(res => {
        if (res instanceof Error) {
          reject(res);
        }
        resolve(res);
      });
    });
  },
}
