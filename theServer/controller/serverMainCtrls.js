
// 200: OK, A successful GET or PUT request
// 201: Created, A successful POST request
// 204: No Content, A successful DELETE request
// 302; ?????? response.statusCode:  302
// 400: Bad Request, An unsuccessful GET, POST, or PUT request, due to invalid content
// 401: Unauthorized, Requesting a restricted URL with incorrect credentials
// 404: Not Found, Unsuccessful request due to an incorrect parameter in the URL
// 404: The status code for an unsuccessful GET request.

// CATCHING ERRORS (getting mean page 176)

var request = require('request');
var passport = require('passport');
var jadeCompiler = require('../lib/pugCompiler.js');
var mailer = require('../lib/mailer.js');
var apiOptions = {
  server : "https://localhost:3000"
};

module.exports.manageSession = function(req, res, next){
  console.log('####### > serverMainCtrls.js > manageSession +++++++')
  if (!req.session.username) {
    return next();
  }else{

  }
}

// data not found by provided ID
// return page cannot be found error
var handleErrorX = function (req, res, statusCode) {
  console.log("####### > handleErrorX > statusCode!!!!!!!!!!: ", statusCode)
  var title, content;
  if (statusCode === 404) {
    title = "404, page not found";
    content = "The page you requested cannot be found. Please try again. \n\n If this problem continues, please contact our Help Desk at 555-555-1234 for assistance.";
  } else if (statusCode === 500) {
    title = "500, internal server error";
    content = "There is a problem with our server. Please try again. \n\n If this problem continues, please contact our Help Desk at 555-555-1234 for assistance.";
  } else {
    title = statusCode + ", error processing request";
    content = "An Error has occurred processing your request. Please try again. \n\n If this problem continues, please contact our Help Desk at 555-555-1234 for assistance.";
  }
  console.log("####### > handleErrorX > statusCode!!!!!!!!!! > RENDER!!!!: ", statusCode)
  res.render('basicView', {
    title : title,
    pageHeader: {
      header: title
    },
    content : content
  });
};



module.exports.handleError = function (req, res, statusCode) {
  console.log("####### > handleError > statusCode!!!!!!!!!!: ", statusCode)
  var title, content;
  if (statusCode === 404) {
    title = "404, page not found";
    content = "The page you requested cannot be found. Please try again. \n\n If this problem continues, please contact our Help Desk at 555-555-1234 for assistance.";
  } else if (statusCode === 500) {
    title = "500, internal server error";
    content = "There is a problem with our server. Please try again. \n\n If this problem continues, please contact our Help Desk at 555-555-1234 for assistance.";
  } else {
    title = statusCode + ", error processing request";
    content = "An Error has occurred processing your request. Please try again. \n\n If this problem continues, please contact our Help Desk at 555-555-1234 for assistance.";
  }
  res.status(statusCode);
  res.render('basicView', {
    title : title,
    pageHeader: {
      header: title
    },
    content : content
  });
};


/* +++++++++++++++++++++++++++++++++++++++++++++++++ */
/* +++++++++++++++++++++++++++++++++++++++++++++++++ */

module.exports.getIndex = function(req, res){
  console.log('####### > serverMainCtrls.js > getIndex')
  var requestOptions, path;
  path = '/api/index';
  requestOptions = {
    rejectUnauthorized: false,
    url : apiOptions.server + path,
    method : "GET",
    json : {}
  };
  request(requestOptions, function(err, response) {
    console.log('####### > serverMainCtrls.js > getIndex > request');
    if(err){
      console.log('####### > serverMainCtrls.js > getIndex > request > ERROR!, ', err);
      handleErrorX(req, res, err);
    }else if (response.statusCode === 200) {
      console.log('####### > serverMainCtrls.js > getIndex > request > response.statusCode === 200')
      var htitle = 'Election App 2016!';
      var stitle = 'Log In or Sign Up to join the discussion';
      res.render('indexView', {
        title: 'ThisGreatApp!',
        pageHeader: {
          title: htitle
        },
        subtitle: stitle
      })
    }else{
      handleErrorX(req, res, response.statusCode);
    }
  });
};


/* +++++++++++++++++++++++++++++++++++++++++++++++++ */
/* +++++++++++++++++++++++++++++++++++++++++++++++++ */

module.exports.getComments = function(req, res){
  console.log('####### > serverMainCtrls.js > getAllComments')
  var requestOptions, path;
  path = '/api/comments';
  requestOptions = {
    rejectUnauthorized: false,
    url : apiOptions.server + path,
    method : "GET",
    json : {}
  };
  request(requestOptions, function(err, response, body) {
    console.log('####### > serverMainCtrls.js > getAllComments > request');
    if(err){
      console.log('####### > serverMainCtrls.js > getAllComments > request > ERROR!, ', err);
      handleErrorX(req, res, err);
    }else if (response.statusCode === 200) {
      console.log('####### > serverMainCtrls.js > getAllComments > request > response.statusCode === 200')
      console.log('####### > serverMainCtrls.js > getAllComments > request > response.statusCode === 200 > body:', body)
/*
body: [ { id: '580a613c879a508d02add96c',
    displayname: 'aaa123',
    city: 'Cccccc',
    state: 'Mississippi',
    datecreated: '2016-10-21T18:41:00.093Z' },
  { id: '580a60e8879a508d02add96b',
    displayname: 'aaa123',
    city: 'Cccccc',
    state: 'Oklahoma',
    datecreated: '2016-10-21T18:39:36.880Z' },
  { id: '580a606e2d7ee37f02dfb939',
    displayname: 'aaa123',
    city: 'Cccccc',
    state: 'Oklahoma',
    datecreated: '2016-10-21T18:37:34.157Z' } ]
*/
      var htitle = 'Election App 2016!';
      var stitle = 'Log In or Sign Up to join the discussion';
      var message;
      if (!(body instanceof Array)) {
        message = "API path error!";
        body = [];
      } else {
        if (!body.length) {
          //message = "No data found!";
        }
      }
      res.render('commentsView', {
        csrfToken: req.csrfToken(),
        sideBlurb: "The 2016 presidential election is upon us! Who do you support and what are your comments regarding this hotly contested event?",
        responseBody: body,
        message: message
      })
    }else{
      handleErrorX(req, res, response.statusCode);
    }
  });
};


/* +++++++++++++++++++++++++++++++++++++++++++++++++ */
/* +++++++++++++++++++++++++++++++++++++++++++++++++ */

// form(role="form", id="userProfileForm", action="/userprofile?_method=PUT", method="post")
module.exports.getUserProfile = function(req, res) {
  console.log('####### > serverMainCtrls.js > getUserProfile > req.params.userid:', req.params.userid);
  var requestOptions, path;
  path = '/api/userprofile/' + res.locals.currentUser.id;
  //path = '/api/userprofile?_method=PUT/' + res.locals.currentUser.id;
  requestOptions = {
    rejectUnauthorized: false,
    url : apiOptions.server + path,
    method : "GET",
    json : {}
  };
  console.log('####### > serverMainCtrls.js > getUserProfile > request > PATH:', apiOptions.server + path);
  request(requestOptions, function(err, response, body) {
    console.log('####### > serverMainCtrls.js > getUserProfile > request');
    if(err){
      console.log('####### > serverMainCtrls.js > getUserProfile > request > ERROR!, ', err);
      handleErrorX(req, res, err);
    }else if (response.statusCode === 200) {
      console.log('####### > serverMainCtrls.js > getUserProfile > request > response.statusCode === 200')
      res.render('userProfile', {
        csrfToken: req.csrfToken(),
        title: 'User Profile',
        pageHeader: {
          header: 'User Profile'
        },
        responseBody: body,
        error: req.query.err
      });
    }else{
      handleErrorX(req, res, response.statusCode);
    }
  });
};


/* +++++++++++++++++++++++++++++++++++++++++++++++++ */
/* +++++++++++++++++++++++++++++++++++++++++++++++++ */

module.exports.putUserProfile = function(req, res){
  console.log('####### > serverMainCtrls.js > putUserProfile > res.locals.currentUser.id:', res.locals.currentUser.id);
  var requestOptions, path, postdata;
  path = "/api/userprofile/" + res.locals.currentUser.id;

  var reqBody = req.body;
  var userProfileChangeKey;
  var userProfileChangeValue;
  for (var v in reqBody){
    if (typeof reqBody[v] !== 'function') {
      if(v !== '_csrf') {
        userProfileChangeKey = v;
        userProfileChangeValue = reqBody[v];
      }
    }
  }
  //console.log('####### > serverMainCtrls.js > putUserProfile > userProfileChangeKey: ', userProfileChangeKey);
  //console.log('####### > serverMainCtrls.js > putUserProfile > userProfileChangeValue: ', userProfileChangeValue);

  console.log('####### > serverMainCtrls.js > putUserProfile > userProfileChangeKey: ', userProfileChangeKey);
  console.log('####### > serverMainCtrls.js > putUserProfile > typeof userProfileChangeKey: ', typeof userProfileChangeKey);

  console.log('####### > serverMainCtrls.js > putUserProfile > userProfileChangeValue: ', userProfileChangeValue);
  console.log('####### > serverMainCtrls.js > putUserProfile > typeof userProfileChangeValue: ', typeof userProfileChangeValue);

  var val = userProfileChangeValue
  if(userProfileChangeKey === "state"){
    val = JSON.parse(userProfileChangeValue);
  }

  console.log('####### > serverMainCtrls.js > putUserProfile > val: ', val);
  console.log('####### > serverMainCtrls.js > putUserProfile > typeof val: ', typeof val);

  postdata = {
    [userProfileChangeKey]: val
  };

  requestOptions = {
    rejectUnauthorized: false,
    url : apiOptions.server + path,
    method : "PUT",
    json : postdata
  };

  var objKey = Object.keys(postdata)

  if (!objKey[0]) {
    var m = 'All User Profile fields required'
    res.redirect('/userprofile/' + req.params.userid + '/?err='+m);

  } else {
    request(requestOptions, function(err, response, body) {
      console.log('####### > serverMainCtrls.js > putUserProfile > request > response.statusCode: ', response.statusCode);
      if (response.statusCode === 200) {
        console.log('####### > serverMainCtrls.js > putUserProfile > request > response.statusCode === 200');
        res.redirect("/userprofile")

      } else if (response.statusCode === 400 && body.name && body.name === "ValidationError" ) {
        console.log('####### > serverMainCtrls.js > putUserProfile > request > response.statusCode === 400');
        handleErrorX(req, res, response.statusCode);

      } else if (response.statusCode === 404) {

      } else {
        console.log('####### > serverMainCtrls.js > putUserProfile > response.statusCode === ???');
        if (body.message){
          m = body.message
          res.redirect('/signup/?err='+m);
        }
        handleErrorX(req, res, response.statusCode);
      }
    });
  }
};


/* +++++++++++++++++++++++++++++++++++++++++++++++++ */
/* +++++++++++++++++++++++++++++++++++++++++++++++++ */
/*
displayname:
id:
city:
state:
datecreated:
candidate:
comment:
*/
/*
>>>>>>>>>>>>>>>>>>>>> res.locals
{ currentUser: 
   { _id: 5804c5c8788ffd9e01276b49,
     hash: '4c85f6ebe029f139735ebce01cd7a079ed2a44c1cda3ced4e8986167b408dd52f9a0dde74ba21870e850970bc422f875f4552b7d8667c44f6cf111e2c42a7393',
     salt: 'cb5a11327e2fbd36d27259e0daf728ac',
     state: { initials: 'PA', full: 'Pennsylvania' },
     city: 'Philadelphia',
     lastname: 'McFranklin',
     firstname: 'BenjaminBenjaminBenjaminBenjaminBenjaminBenjamin',
     email: 'bigbadbenjamin.mcfranklin@uspresidents.org',
     displayname: 'bigBen123',
     __v: 0,
     lastlogin: 2016-10-18T16:45:26.756Z,
     previouslogin: 2016-10-18T15:40:34.416Z,
     datecreated: 2016-10-17T12:36:24.160Z } }


####### > serverMainCtrls.js > postComment > res.locals.currentUser.state :  object
####### > serverMainCtrls.js > postComment > stateJsonObj :  {"full":"Florida","initials":"FL"}
####### > serverMainCtrls.js > postComment > res.locals.currentUser.id :  580771261928bc6e024bb08c
####### > serverMainCtrls.js > postComment > postdata.displayname :  aaa123
####### > serverMainCtrls.js > postComment > postdata.commenterId :  undefined
####### > serverMainCtrls.js > postComment > postdata.city :  Cccccc
####### > serverMainCtrls.js > postComment > postdata.state :  { full: 'Florida', initials: 'FL' }
####### > serverMainCtrls.js > postComment > postdata.datecreated :  function now() { [native code] }
####### > serverMainCtrls.js > postComment > postdata.candidate :  Donald Trump
####### > serverMainCtrls.js > postComment > postdata.comment :  Cmvmdovmdmvdvdf. Dpmcdsmcdsmcdios. Tcjkcksjndskjcsdcj.  


####### > serverMainCtrls.js > putUserProfile > userProfileChangeKey:  state
####### > serverMainCtrls.js > putUserProfile > typeof userProfileChangeKey:  string

####### > serverMainCtrls.js > putUserProfile > userProfileChangeValue:  {"initials":"OK","full":"Oklahoma"}
####### > serverMainCtrls.js > putUserProfile > typeof userProfileChangeValue:  string

####### > serverMainCtrls.js > putUserProfile > val:  { initials: 'OK', full: 'Oklahoma' }
####### > serverMainCtrls.js > putUserProfile > typeof val:  object

####### > serverMainCtrls.js > postComment > postdata.state :  { full: 'Oklahoma', initials: 'OK' }
####### > serverMainCtrls.js > postComment > typeof postdata.state :  object

*/


module.exports.postMainComment = function(req, res){
  console.log('####### > serverMainCtrls.js > postComment');
  var requestOptions, path, postdata;
  path = '/api/comments/mainComment';
  // res.locals.currentUser.state :  { full: 'Washington', initials: 'WA' } TYPEOF: object
  //console.log('####### > serverMainCtrls.js > postComment > res.locals.currentUser.state : ', typeof res.locals.currentUser.state);
  var voo = res.locals.currentUser.state;
  //var stateJsonObj = JSON.parse(voo);
  var jsonString = JSON.stringify(voo);
  //console.log('####### > serverMainCtrls.js > postComment > stateJsonObj : ', jsonString);
  //console.log('####### > serverMainCtrls.js > postComment > res.locals.currentUser.id : ', res.locals.currentUser.id);
  postdata = {
    displayname: res.locals.currentUser.displayname,
    commenterId: res.locals.currentUser.id,
    city: res.locals.currentUser.city,
    state: res.locals.currentUser.state,
    candidate: req.body.candidate,
    comment: req.body.comment
  };
  requestOptions = {
    rejectUnauthorized: false,
    url : apiOptions.server + path,
    method : "POST",
    json : postdata
  };
  console.log('####### > serverMainCtrls.js > postComment > postdata.displayname : ', res.locals.currentUser );
  console.log('####### > serverMainCtrls.js > postComment > postdata.displayname : ', res.locals.currentUser.displayname );
  console.log('####### > serverMainCtrls.js > postComment > postdata.commenterId : ', res.locals.currentUser.id );
  console.log('####### > serverMainCtrls.js > postComment > postdata.city : ', res.locals.currentUser.city );
  console.log('####### > serverMainCtrls.js > postComment > postdata.state : ', res.locals.currentUser.state );
  console.log('####### > serverMainCtrls.js > postComment > typeof postdata.state : ', typeof res.locals.currentUser.state );
  console.log('####### > serverMainCtrls.js > postComment > postdata.candidate : ', req.body.candidate );
  console.log('####### > serverMainCtrls.js > postComment > postdata.comment : ', req.body.comment );

  if (!postdata.displayname || !postdata.commenterId || !postdata.city || !postdata.state || !postdata.candidate || !postdata.comment) {
    console.log('####### > serverMainCtrls.js > postComment > postdata ERROR');
    m = 'All Sign up fields required';
    res.redirect('/comments/?err='+m);
  } else {
    request(requestOptions, function(err, httpResponse, body) {
      if (httpResponse.statusCode === 201) {
        res.redirect('/comments');
      } else if (httpResponse.statusCode === 400 && body.name && body.name === "ValidationError" ) {
          //res.redirect('/location/' + locationid + '/reviews/new?err=val');
          console.log('####### > serverMainCtrls.js > requestAddNewComment > httpResponse error 2');
          m = 'Error has ocurred (serverMainCtrls.js > requestAddNewComment)';
          res.redirect('/comments/?err='+m);
      } else {
          console.log(body);
          console.log('####### > serverMainCtrls.js > postComment > request error > body:', body);
          handleErrorX(req, res, response.statusCode);
      }
    });
  }
};

// <a href="#my_modal" data-toggle="modal" data-book-id="my_id_value">Open Modal</a>
/*
//triggered when modal is about to be shown

  $('#my_modal').on('show.bs.modal', function(e) {
      //get data-id attribute of the clicked element
      var bookId = $(e.relatedTarget).data('book-id');
      //populate the textbox
      $(e.currentTarget).find('input[name="bookId"]').val(bookId);
  });

*/
// eventEmitter.emit() method 
module.exports.postSubComment = function(req, res){
  console.log('####### > serverMainCtrls.js > postSubComment1: ', req.params.subcommentid);
  console.log('####### > serverMainCtrls.js > postSubComment2: ', req.body);
  var requestOptions, path, subcommentid, postdata;
  subcommentid = req.params.subcommentid;
  path = '/api/comments/subcomment/' + subcommentid;
  postdata = {
    displayname: res.locals.currentUser.displayname,
    commenterId: res.locals.currentUser.id,
    city: res.locals.currentUser.city,
    state: res.locals.currentUser.state,
    comment: req.body.comment
  };
  requestOptions = {
    rejectUnauthorized: false,
    url : apiOptions.server + path,
    method : "POST",
    json : postdata
  };

  console.log('####### > serverMainCtrls.js > postSubComment > postdata.displayname : ', postdata.displayname );
  console.log('####### > serverMainCtrls.js > postSubComment > postdata.commenterId : ', postdata.commenterId );
  console.log('####### > serverMainCtrls.js > postSubComment > postdata.city : ', postdata.city  );
  console.log('####### > serverMainCtrls.js > postSubComment > postdata.state : ', postdata.state );
  console.log('####### > serverMainCtrls.js > postSubComment > typeof postdata.state : ', typeof postdata.state );
  console.log('####### > serverMainCtrls.js > postSubComment > postdata.comment : ', postdata.comment );

  if (!postdata.displayname || !postdata.commenterId || !postdata.city || !postdata.state || !postdata.comment) {
    console.log('####### > serverMainCtrls.js > postSubComment > postdata ERROR');
    m = 'All Comment Reply fields required';
    res.redirect('/comments/subcomment/' + subcommentid + '/?err='+m);
  } else {
    request(requestOptions, function(err, response, body) {
      if (response.statusCode === 201) {
        res.redirect('/comments');
      } else if (response.statusCode === 400 && body.name && body.name === "ValidationError" ) {
          //res.redirect('/location/' + locationid + '/reviews/new?err=val');
          console.log('####### > serverMainCtrls.js > postSubComment > request > httpResponse error');
          m = 'Error has ocurred > serverMainCtrls.js > postSubComment)';
          res.redirect('/comments/subcomment/' + subcommentid + '/?err='+m);
      } else {
          console.log(body);
          console.log('####### > serverMainCtrls.js > postSubComment > request error > 404');
          handleErrorX(req, res, response.statusCode);
      }
    });
  }
};



/* +++++++++++++++++++++++++++++++++++++++++++++++++ */
/* +++++++++++++++++++++++++++++++++++++++++++++++++ */

module.exports.getAddNewComment = function(req, res) {
    //console.log('####### > serverMainCtrls.js > getAddNewComment');
    res.render('addNewCommentView', {
    title: 'MEANCRUDApp',
    sideBlurb: "The 2016 presidential election is upon us! Who do you support and what are your comments regarding this hotly contested event?"
    });
};

/* +++++++++++++++++++++++++++++++++++++++++++++++++ */
/* +++++++++++++++++++++++++++++++++++++++++++++++++ */


module.exports.getLogout = function(req, res){
  console.log('####### > serverMainCtrls.js > getLogout');
  req.logout();
  res.redirect('/');
  /*
  req.session.destroy(function(err) {
    if(err){
      handleErrorX(req, res, err);
      return;
    }
    console.log('####### > serverMainCtrls.js > getLogout > req.session.destroy');
    req.logout();
    res.redirect('/');
  });*/
};

/* +++++++++++++++++++++++++++++++++++++++++++++++++ */
/* +++++++++++++++++++++++++++++++++++++++++++++++++ */

// req.session.regenerate
// Update the current session id with a newly generated one
// will replace the current session id with a new one, and keep the current session information
// will also submit a new session cookie with the new session id
// prevent session fixation, XSS
/* 
It mainly helps prevent session fixation attacks. 
Session fixation attacks is where a malicious user tries to exploit the vulnerability in a system to 
fixate (set) the session ID (SID) of another user. 
By doing so, they will get complete access as the original user 
and be able to do tasks that would otherwise require authentication.

To prevent such attacks, assign the user a new session ID using session_regenerate_id() when he successfully signs in (or for every X requests). 
Now only he has the session ID, and your old (fixated) session ID is no longer valid.

  var d = new Date();
  var time = d.getTime()
  new Date(time);

  To handle concurrent session , you need to create unique Session ID and give it to client once the session is set so 
  that next time until they logout / close browser they need to pass that unique ID 
  in every request they made to server and you need to check it in every router.
*/


// // arsWinOSX_10@outlook.com
module.exports.postResetPassword = function(req, res){
  var hostname = req.headers.host;
  console.log('####### > serverMainCtrls.js > postResetPassword:', req.body.email);
  console.log('####### > serverMainCtrls.js > postResetPassword > hostname:', hostname);
  var requestOptions, path, postdata, m;
  path = '/api/resetcredentials';
  postdata = {
    email: req.body.email
  };
  requestOptions = {
    rejectUnauthorized: false,
    url : apiOptions.server + path,
    method : "POST",
    json : postdata
  };

  if (!postdata.email) {
    m = 'All Login fields required'
    res.redirect('/resetpassword/?err='+m);

  } else {
    
    request(requestOptions, function(err, response, body) {

        if (response.statusCode === 201) {
          // ++++++++++++++++++++++++++++++++++++++++++++++++++
          console.log('####### > serverMainCtrls.js > postResetPassword > request > response.statusCode === 201 > body:', body); 

          //var FROM_ADDRESS = 'accounts@test.com';
          //var TO_ADDRESS = req.body.toEmail;
          //var SUBJECT = req.body.firstName + ', check out this test email from my cool node.js app.';
          var RELATIVE_TEMPLATE_PATH = 'emailConfirmation'; 

          var data = {
            title: 'ThisGreatApp!',
            pageHeader: {
              title: 'Confirmation Email Here!!!'

            },
            email: req.body.email
          };
          
          res.render('emailConfirmation', {
            title: 'ThisGreatApp!',
            pageHeader: {
              title: 'Confirmation Email Here!!!'
            },
            email: req.body.email,
            RELATIVE_TEMPLATE_PATH: RELATIVE_TEMPLATE_PATH
          })

          /*
          jadeCompiler.compile(RELATIVE_TEMPLATE_PATH, data, function(err, html){
            if(err){
              handleErrorX(req, res, err);
              return;
            }
            mailer.sendMail(FROM_ADDRESS, TO_ADDRESS, SUBJECT, html, function(err, success){
              if(err){
                handleErrorX(req, res, err);
                return;
              }
                m = 'Password reset submitted!';
                res.redirect('/resetpassword/?success='+m);
            });
          });
          */
          // ++++++++++++++++++++++++++++++++++++++++++++++++++
        } else {
          console.log('####### > serverMainCtrls.js > postResetPassword > request > ERROR: ', err);
          handleErrorX(req, res, response.statusCode);
        }
    });
  }
};

module.exports.postLogin = function(req, res, next){
  console.log('####### > serverMainCtrls.js > postLogin');
  var requestOptions, path, postdata, m;
  path = '/api/login';
  postdata = {
    email: req.body.email,
    password: req.body.password
  };
  requestOptions = {
    rejectUnauthorized: false,
    url : apiOptions.server + path,
    method : "POST",
    json : postdata
  };
  if (!postdata.email || !postdata.password) {
    m = 'All fields required'
    res.redirect('/login/?err='+m);
  } else {
    // API > postLoginResponse
    request(requestOptions, function(err, response, body) {

        if (response.statusCode === 201) {

          passport.authenticate('local', function(err, user, info){
            console.log('####### > serverMainCtrls.js > postLogin > passport.authenticate1');
            if (err) {
              console.log('####### > serverMainCtrls.js > postLogin > passport.authenticate > ERROR > err: ', err);
              m = 'Authentication Error'
              return res.redirect('/login/?err='+m);
            }
            if (!user) { 
              console.log('####### > serverMainCtrls.js > postLogin > passport.authenticate > !USER > !user: ', user);
              m = 'Invalid login credentials'
              return res.redirect('/login/?err='+m);
            }


          /* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
          /* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
            req.logIn(user, function(err) {
              if (err) { 
                console.log('####### > serverMainCtrls.js > postLogin > passport.authenticate > req.logIn > ERROR');
                m = 'Authentication Login Error1'
                return res.redirect('/login/?err='+m);
              }
              path = '/api/login/' + user.id;
              requestOptions = {
                rejectUnauthorized: false,
                url : apiOptions.server + path,
                method : "PUT"
              };
              // API > updateUserResponse
              request(requestOptions, function(err, response, body) {
                if (response.statusCode === 200) {
                  req.session.save(function (err) {
                    if (err) {
                      console.log('####### > serverMainCtrls.js > postLogin > passport.authenticate > req.logIn > req.session.save2 > ERROR');
                      m = 'Authentication Login Error2'
                      return res.redirect('/login/?err='+m);
                    }
                    console.log('####### > serverMainCtrls.js > postLogin > passport.authenticate2:', user.id);
                    res.redirect('/comments');
                  })
                }else{
                  console.log('####### > serverMainCtrls.js > postLogin > passport.authenticate2 > ERROR');
                  handleErrorX(req, res, response.statusCode);
                }
              });
            });

          })(req, res, next);
          /* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
          /* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
        }else if (response.statusCode === 400) {
          return res.redirect('/login/?err='+body);
        }else {
          console.log('####### > serverMainCtrls.js > postLogin > passport.authenticate > response.statusCode: ', response.statusCode);
          // data for ID not found
          // catch when the API returns a 404 status, using response.statusCode in the request callback
          handleErrorX(req, res, response.statusCode);
        }
    });
  }
};

/* +++++++++++++++++++++++++++++++++++++++++++++++++ */
/* +++++++++++++++++++++++++++++++++++++++++++++++++ */

module.exports.postSignup = function(req, res, next){
  console.log('####### > serverMainCtrls.js > postSignup')
  var requestOptions, path, postdata, m;
  path = '/api/signup';
  
  console.log('####### > serverMainCtrls.js > postSignup > req.body.state: ', req.body.state)
  var stateJsonObj = JSON.parse(req.body.state);
  console.log('####### > serverMainCtrls.js > postSignup > stateJsonObj: ', stateJsonObj)

  req.body.state = stateJsonObj
  postdata = {
    displayname: req.body.displayname,
    email: req.body.email,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    city: req.body.city,
    state: req.body.state
  };
  requestOptions = {
    rejectUnauthorized: false,
    url : apiOptions.server + path,
    method : "POST",
    json : postdata
  };

  if (!postdata.email || !postdata.displayname || !postdata.password || !postdata.firstname || !postdata.lastname || !postdata.city || !postdata.state) {
    console.log('####### > serverMainCtrls.js > postSignup > postdata > ERROR!!!!')
    m = 'All Sign up fields required'
    res.redirect('/signup/?err='+m);

  } else {

    request(requestOptions, function(err, response, body) {
      console.log('####### > serverMainCtrls.js > postSignup > request')

      if (response.statusCode === 201) {

        passport.authenticate('local', function(err, user, info){
          console.log('####### > serverMainCtrls.js > postSignup > passport.authenticate1');
          if (err) {
            console.log('####### > serverMainCtrls.js > postSignup > passport.authenticate > ERROR');
            handleErrorX(req, res, response.statusCode);
            return;
          }

          if(user){
            console.log('####### > serverMainCtrls.js > postSignup > passport.authenticate2 > USER: ', req.user);
            req.logIn(user, function(err) {
              if (err) { 
                console.log('####### > serverMainCtrls.js > postSignup > passport.authenticate22 > ERORR: ');
                handleErrorX(req, res, response.statusCode);
                return;
              }
              req.session.save(function (err) {
                if (err) {
                  console.log('####### > serverMainCtrls.js > postSignup > passport.authenticate22222 > ERORR: ');
                  handleErrorX(req, res, response.statusCode);
                  return;
                }
                console.log('####### > serverMainCtrls.js > postSignup > passport.authenticate3 > req.logIn > req.user: ', req.user);
                //res.redirect('/userprofile');
                res.redirect('/comments');
              })
            });
          } else {
            handleErrorX(req, res, response.statusCode);
          }
        })(req, res, next);


      } else if (response.statusCode === 409 ) {
        console.log('####### > serverMainCtrls.js > postSignup > passport.authenticate2 > body.message: ', body.message);
        //var b = '/signup/?err='
        //var c = body.message
        //res.redirect(b+c);
        m = body.message
        res.redirect('/signup/?err='+m);

      } else if (response.statusCode === 400 && body.name && body.name === "ValidationError" ) {
        console.log('####### > serverMainCtrls.js > postSignup > passport.authenticate3 > ValidationError !!!!');
        handleErrorX(req, res, response.statusCode);

      } else {
        console.log('####### > serverMainCtrls.js > postSignup > passport.authenticate3 > body.message!!!!!!: ', body.message);
        console.log('####### > serverMainCtrls.js > postSignup > passport.authenticate3 > body.message!!!!!!: ', body);
        if (body.message){
          m = body.message
          res.redirect('/signup/?err='+m);
        }
        handleErrorX(req, res, response.statusCode);
      }
    });
  }
};
/* +++++++++++++++++++++++++++++++++++++++++++++++++ */
/* +++++++++++++++++++++++++++++++++++++++++++++++++ */


module.exports.getResetPassword = function(req, res) {
  var hostname = req.headers.host;
  console.log('####### > serverMainCtrls.js > getResetPassword > hostname:', hostname);
  res.render('resetcredentials', {
    csrfToken: req.csrfToken(),
    title: 'Reset Password',
    pageHeader: {
      header: 'Reset my Password'
    },
    error: req.query.err,
    success: req.query.success
  });
};

module.exports.getMembersOnly = function(req, res) {
  console.log('####### > serverMainCtrls.js > getMembersOnly');
  res.render('membersonly', {
    title: 'Members Only Page',
    pageHeader: {
      header: 'Hello Authorized Users!'
    },
    error: req.query.err
  });
};

module.exports.getLoginOrSignup = function(req, res) {
  console.log('####### > serverMainCtrls.js > getLoginOrSignup');
  res.render('loginorsignup', {
    title: 'Sign Up or Login',
    pageHeader: {
      header: 'Sign Up or Login to use Election App 2016.'
    },
    error: req.query.err
  });
};


module.exports.getLogin = function(req, res) {
  console.log('####### > serverMainCtrls.js > getLogin');
  res.render('login', {
    csrfToken: req.csrfToken(),
    title: 'Log In',
    pageHeader: {
      header: 'Welcome back!'
    },
    error: req.query.err
  });
};

//csrfToken: req.csrfToken(),
module.exports.getSignup = function(req, res) {
  console.log('####### > serverMainCtrls.js > getSignup');
  res.render('signup', {
    csrfToken: req.csrfToken(),
    title: 'Sign Up',
    pageHeader: {
      header: 'Sign up'
    },
    error: req.query.err
  });
};

module.exports.getResouces = function(req, res) {
  res.render('resources', {
    title: 'Resources',
    pageHeader: {
      header: 'Resouces for Election App 2016'
    },
    content: 'ThisGreatApp! is all about people sharing their favorite novelties across America.\n\nAut tenetur sit quam aliquid quia dolorum voluptate. Numquam itaque et hic reiciendis. Et eligendi quidem officia maiores. Molestiae ex sed vel architecto nostrum. Debitis culpa omnis perspiciatis vel eum. Vitae doloremque dolor enim aut minus.\n\nPossimus quaerat enim voluptatibus provident. Unde commodi ipsum voluptas ut velit. Explicabo voluptas at alias voluptas commodi. Illum et nihil ut nihil et. Voluptas iusto sed facere maiores.'
  });
};

module.exports.getDummyPage = function(req, res) {
  res.render("dummypage", {
    title: "About",
    pageHeader: {
      header: "+++ Test Page !!!"
    }
  });
};

module.exports.getAbout = function(req, res) {
  res.render('basicView', {
    title: 'About',
    pageHeader: {
      header: 'About ThisGreatApp!'
    },
    content: 'ThisGreatApp! is all about people sharing their favorite novelties across America.\n\nAut tenetur sit quam aliquid quia dolorum voluptate. Numquam itaque et hic reiciendis. Et eligendi quidem officia maiores. Molestiae ex sed vel architecto nostrum. Debitis culpa omnis perspiciatis vel eum. Vitae doloremque dolor enim aut minus.\n\nPossimus quaerat enim voluptatibus provident. Unde commodi ipsum voluptas ut velit. Explicabo voluptas at alias voluptas commodi. Illum et nihil ut nihil et. Voluptas iusto sed facere maiores.'
  });
};

module.exports.getContact = function(req, res) {
  res.render('basicView', {
    title: 'Contact',
    pageHeader: {
      header: 'Contact ThisGreatApp!'
    },
    content: 'ThisGreatApp! can be contacted by calling 1-800-555-1234.\n\nDolorem necessitatibus aliquam libero magni. Quod quaerat expedita at esse. Omnis tempora optio laborum laudantium culpa pariatur eveniet consequatur.'
  });
};

module.exports.getTeam = function(req, res) {
  res.render('basicView', {
    title: 'Team',
    pageHeader: {
      header: 'Meet the Team'
    },
    content: 'The team behind ThisGreatApp! are a dedicated bunch who enjoy sharing favorite places and experiences.\n\nAt vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.'
  });
};

