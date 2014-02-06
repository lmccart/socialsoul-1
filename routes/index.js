
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Main' });
};


exports.controller = function(req, res){
  res.render('controller', { title: 'Controller' });
};