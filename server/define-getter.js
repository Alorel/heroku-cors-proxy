module.exports = (obj, name, fn) => {
  Object.defineProperty(obj, name, {
    get() {
      const value = fn.call(obj);
      Object.defineProperty(obj, name, {
        value,
        configurable: true,
        enumerable: true
      });

      return value;
    },
    configurable: true,
    enumerable: true
  })
};