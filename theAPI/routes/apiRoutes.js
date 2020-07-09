
var express 		= require("express");
var router 			= express.Router();
var apiControllers 	= require("../controller/apiMainCtrls");
var auth            = require("../../shared/auth");

router.use(function(req, res, next) {
	console.log("####### > apiRoutes.js > router.use > req.user: ", req.user)
	console.log("####### > apiRoutes.js > router.use > res.locals.currentUser: ", res.locals.currentUser)
	next();
});

router.get("/index", apiControllers.getIndexResponse);

router.get("/comments", apiControllers.getCommentsResponse);

router.post("/comments/maincomment", apiControllers.postMainCommentResponse);

router.post("/comments/subcomment/:subcommentid", apiControllers.postSubCommentResponse);

//router.get('/edituser', apiControllers.getEditUserResponse);

router.post("/signup", apiControllers.postSignUpResponse);

router.post("/login", apiControllers.postLoginResponse);

router.post("/resetcredentials", apiControllers.postResetPasswordResponse);

router.get("/userprofile/:userid", apiControllers.getUserProfileResponse);

router.put("/userprofile/:userid", apiControllers.putUserProfileResponse);

router.put("/login/:userid", apiControllers.updateUserResponse);

router.get("/:commentid", apiControllers.getOneCommentResponse);

module.exports = router;
