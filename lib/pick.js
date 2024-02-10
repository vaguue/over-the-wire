const has = (obj, k) => obj[k] !== undefined;

const pick = (obj, ...keys) => keys.reduce((res, e) => has(obj, e) ? { ...res, [e]: obj[e] } : res, {});

const omit = (obj, ...keys) => keys.reduce((res, e) => (keys.includes(e) || !has(obj, e)) ? res : { ...res, [e]: obj[e] }, {});

module.exports = {
  pick,
  omit,
};
