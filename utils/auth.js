const withAuth = (req, res, next) => {
  if (!req.session.logged_in) {
    res.redirect('/index.html');
  } else {
    next();
  }
};

module.exports = withAuth;