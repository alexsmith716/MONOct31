// cd documents/october25/october28/monoct31


// Last TO Do 
// 1. error handling
// 2. paginate 
// 3. delete user profile
// 4. polish commentsView
// 5. check reroute on login/signup

// http://getbootstrap.com/components/  Pagination
// https://www.npmjs.com/package/csurf
// https://www.npmjs.com/package/bluebird
// https://www.npmjs.com/package/passport
// https://www.npmjs.com/package/csrf
// https://www.npmjs.com/package/express-session
// https://www.npmjs.com/package/connect-mongo
// https://github.com/expressjs/method-override
// https://github.com/expressjs/csurf

// (CSRF) is an attack which forces an end user to execute unwanted actions 
// on a web application to which they are currently authenticated.

var express 		= require('express');
var helmet 			= require('helmet')
var fs 				= require('fs');
var https 			= require('https');
var path 			= require('path');
var cookieParser 	= require("cookie-parser");
var bodyParser 		= require('body-parser');
var logger 			= require("morgan");
var mongoose 		= require('mongoose');
var passport    	= require('passport');
var methodOverride 	= require('method-override');
var parseurl 		= require('parseurl');
var session     	= require('express-session');
var MongoStore 		= require('connect-mongo')(session);
var setUpPassport 	= require('./theAPI/model/setuppassport');
var serverRoutes 	= require('./theServer/routes/serverRoutes');
var apiRoutes 		= require('./theAPI/routes/apiRoutes');
require('./theAPI/model/dbConnector');
var serverControllers = require('./theServer/controller/serverMainCtrls');
var app       		= express();
app.disable('x-powered-by');

var options = {
	key: fs.readFileSync(__dirname + '/ssl/thisgreatappPEM.pem'),
	cert: fs.readFileSync(__dirname + '/ssl/thisgreatappCRT.crt')
};


/*
methodOverride middleware allows an HTTP request to override the HTTP verb with the value of the _method post parameter 
or with the x-http-method-override header. 
As the declaration order of middlewares determines the execution stack in Connect, 
it is possible to abuse this functionality in order to bypass the standard Connect’s anti-CSRF protection.
*/


// chrome://flags/#allow-insecure-localhost
// openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout thisgreatappPEM.pem -out thisgreatappCRT.crt

setUpPassport();

app.set('views', path.join(__dirname, 'theServer', 'views'));
app.set('view engine', 'pug');
//app.set('view cache', true);

app.use(helmet());
//app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(methodOverride('_method'));
app.use(logger('short'));

// maxAge: Specifies the number (in milliseconds) to use when calculating the Expires Set-Cookie attribute
// Session data is not saved in the cookie itself, just the session ID
// 60 * 60 * 1000 1 hour
var cookieExpiryDate = new Date( Date.now() + 14 * 24 * 60 * 60 );
var sessExpiryDate = 5 * 60 * 60 * 1000;
// req.session.destroy();

app.use(session({
    secret: 'superSolidSecret',
  	resave: false,
  	saveUninitialized: false,
  	cookie: {
  		secure: true,
  		httpOnly: true,
  		maxAge: sessExpiryDate
  	},
  	name: 'id',
  	store: new MongoStore({
  		url: 'mongodb://localhost/pec2016s',
  		autoRemove: 'native'
  	})
}));
//}),function(req, res, next){console.log('####### > app.js > app.use > SESSION');next();});


app.use(passport.initialize());
app.use(passport.session());
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(csrf({ cookie: false }),function(req, res, next){console.log('####### > app.js > app.use > CSRF');next();});

//var csrfProtection = csrf({ cookie: true })
//var parseForm = bodyParser.urlencoded({ extended: false })

//pass a unique token to the browser
//when the browser then submits a form, the server checks to make sure the token matches
//Modern browsers send Referer and Origin headers with requests when navigating through links or submitting forms on a web page
//They give the application information about which page the request originated from
//they can be used tracking and CSRF protection. use the Origin header 
// XSS cross site scripting

app.use('/signup', function (req, res, next) {
  next();
});

app.use(function(req, res, next){
  console.log('####### > app.js > app.use > req(method/url): ', req.method, " :: ", req.url)
	//req.session._csrf = req.csrfToken();
	//res.locals._csrfToken = req.csrfToken();
  var voo = req.isAuthenticated();
  res.locals.currentUserFOO = req.user;
	console.log('####### > app.js > app.use > req.user: ', req.user)
  console.log('####### > app.js > app.use > res.locals: ', res.locals)
  console.log('####### > app.js > app.use > req.isAuthenticated(): ', voo)
	//console.log('####### > app.js > app.use > res.locals._csrfToken1: ', res.locals._csrfToken1)
  //console.log('####### > app.js > app.use1 > res.locals: ', res.locals)
	var oneHour = 3600000
	//req.session.cookie.expires = new Date(Date.now() + oneHour);
  next();
});


app.use(methodOverride(function(req, res){
  console.log('####### > app.js > app.use > methodOverride > typeof req.body: ', typeof req.body)
  console.log('####### > app.js > app.use > methodOverride > req.body: ', req.body)
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    console.log('####### > app.js > app.use > methodOverride 2 > method: ', method)
    return method
  }
}))


app.use('/', serverRoutes);
app.use('/api', apiRoutes);

module.exports = app;


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	console.log('####### > app.js > app.use > catch 404 and forward to error handler');
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') {
	return next(err) 
  }
  //res.status(403)
  serverControllers.handleError(req, res, err);
})

// error handlers
// Catch unauthorized errors
app.use(function (err, req, res, next) {
	console.log('####### > app.js > app.use > Catch unauthorized errors');
	serverControllers.handleError(req, res, err);
  if (err.name === 'UnauthorizedError') {
  	console.log('####### > app.js > app.use > Catch unauthorized errors > err.name:', err.name);
    //res.status(401);
    serverControllers.handleError(req, res, err);
  }
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	console.log('####### > app.js > app.use > development error handler');
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        serverControllers.handleError(req, res, err);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	console.log('####### > app.js > app.use > production error handler');
    res.status(err.status || 500);
    serverControllers.handleError(req, res, err);
});
/*
https.createServer(options, app).listen(app.get('port'), function(){ 
	console.log('Express started in ' + app.get('env') + ' mode on port ' + app.get('port') + '.');
});*/

https.createServer(options, app).listen(3000);
/*
app.listen(3000, function() {
  console.log('####### > listening on http://localhost:3000');
});
*/
