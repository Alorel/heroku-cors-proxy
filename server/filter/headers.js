module.exports = (req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('X-Frame-Options', 'deny');
  res.header('X-Powered-By', "Trump's tiny cocktail sausage fingers");
  res.header('X-source-code', 'https://github.com/Alorel/heroku-cors-proxy');
  setImmediate(next);
};