module.exports.ensureAuthenticated = function(req, res, next){
  console.log('####### > serverMainCtrls.js > ensureAuthenticated')
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/loginorsignup');
  }
}
module.exports.ensureNotAuthenticated = function(req, res, next){
  console.log('####### > serverMainCtrls.js > ensureNotAuthenticated')
  if (!req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
  }
}