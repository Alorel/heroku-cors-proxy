module.exports = (req, res, next) => {
  try {
    if (!req.origin) {
      res.badRequest('Could not determine origin');
    } else if (!req.originHostname) {
      res.badRequest('Failed to parse origin');
    } else {
      setImmediate(next);
    }
  } catch (e) {
    res.error(e);
  }
};