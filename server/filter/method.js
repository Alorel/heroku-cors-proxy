module.exports = (req, res, next) => {
  const meth = req.method.toLowerCase();

  if (meth !== 'get' && meth !== 'options') {
    res.status(405).end();
  } else {
    setImmediate(next);
  }
};