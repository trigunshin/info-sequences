/*
 * GET home page.
 */
var dbmux;
exports.set_dbmux = function(a_dbmux) {
    dbmux = a_dbmux;
};

exports.index = function(req, res) {
  res.render('index', {title: 'Express'});
};

exports.hyper = function(req, res) {
  req.session.email='t@g.c';
  res.render('hypertree', {title: 'Hypertree!'});
};
