
var express 			    = require("express");
var router 				    = express.Router();
var serverControllers = require("../controller/serverMainCtrls");
var auth              = require("../../shared/auth");
var csrf 				      = require("csurf");
var csrfProtection 		= csrf({ cookie: true });

router.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  console.log("####### > serverRoutes.js > router.use > res.locals.currentUser!: ", res.locals.currentUser)
  //session collection (paginate location, last page visited)
  if(res.locals.currentUser){
  	req.session.paginateFrom = res.locals.sortDocsFrom
  	console.log("####### > serverRoutes.js > router.use > req.session: ", req.session)
  	//console.log('####### > serverRoutes.js > router.use > req.session.paginateFrom: ', req.session.paginateFrom)
  	//req.session.paginateFrom = 44
  	req.session.lastPageVisited = "/indexView"
  }
  next();
});

router.get("/", serverControllers.getIndex);

router.get("/comments", csrfProtection, auth.ensureAuthenticated, serverControllers.getComments);

router.post("/comments/maincomment", csrfProtection, auth.ensureAuthenticated, serverControllers.postMainComment);

router.post("/comments/subcomment/:subcommentid", csrfProtection, auth.ensureAuthenticated, serverControllers.postSubComment);

//router.get('/comment', auth.ensureAuthenticated, serverControllers.getAddNewComment);

router.get("/signup", auth.ensureNotAuthenticated, csrfProtection, serverControllers.getSignup);
//router.post('/signup', csrfProtection, auth.manageSession, serverControllers.postSignup);
router.post("/signup", csrfProtection, auth.ensureNotAuthenticated, serverControllers.postSignup);

router.get("/login", auth.ensureNotAuthenticated, csrfProtection, serverControllers.getLogin);
router.post("/login", csrfProtection, auth.ensureNotAuthenticated, serverControllers.postLogin);

router.get("/resetcredentials", csrfProtection, auth.ensureAuthenticated, serverControllers.getResetPassword);
router.post("/resetcredentials", csrfProtection, auth.ensureAuthenticated, serverControllers.postResetPassword);

router.get("/userprofile", csrfProtection, auth.ensureAuthenticated, serverControllers.getUserProfile);
router.put("/userprofile", csrfProtection, auth.ensureAuthenticated, serverControllers.putUserProfile);

router.get("/membersonly", auth.ensureAuthenticated, serverControllers.getMembersOnly);

router.get("/loginorsignup", auth.ensureNotAuthenticated,serverControllers.getLoginOrSignup);

router.get("/dummypage", serverControllers.getDummyPage);

router.get("/resources", serverControllers.getResouces);
router.get("/about", serverControllers.getAbout);
router.get("/contact", serverControllers.getContact);
router.get("/team", serverControllers.getTeam);

router.get("/logout", auth.ensureAuthenticated, serverControllers.getLogout);

module.exports = router;




