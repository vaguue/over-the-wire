const pick = (obj, ...keys) => keys.reduce((res, e) => obj[e] !== undefined ? { ...res, [e]: obj[e] } : res, {});

module.exports = {
  pick,
};
