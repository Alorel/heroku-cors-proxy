module.exports = (req, res, next) => {
  try {
    if (!req.target) {
      res.badRequest('URL missing. Usage: /?url=http://some-address');
    } else if (!req.targetHostname) {
      res.badRequest('Failed to parse target');
    } else {
      setImmediate(next);
    }
  } catch (e) {
    res.error(e);
  }
};