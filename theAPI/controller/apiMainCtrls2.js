
// 200: OK, A successful GET or PUT request
// 201: Created, A successful POST request
// 204: No Content, A successful DELETE request
// 400: Bad Request, An unsuccessful GET, POST, or PUT request, due to invalid content
// 401: Unauthorized, Requesting a restricted URL with incorrect credentials
// 404: Not Found, Unsuccessful request due to an incorrect parameter in the URL

var passport = require('passport');
var User = require('../model/user.js');
var paginate = require('mongoose-range-paginate')
var sortKey = 'time'
var sort = '-' + sortKey
var sortDocsFrom = 0;

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

var buildGetCommentsResponse = function(req, res, results) {
  var responseBody = [];
  results.forEach(function(doc) {
    responseBody.push({
      displayname: doc.displayname,
      email: doc.email,
      datecreated: doc.datecreated,
      time: doc.time,
      firstname: doc.firstname,
      lastname: doc.lastname,
      city: doc.city,
      state: doc.state,
      candidate: doc.candidate,
      comment: doc.comment,
      sessiondata: doc.sessiondata,
      _id: doc._id
    });
  });
  return responseBody;
};

function getQuery() {
  return User.find()
    .where({})
}

module.exports.getAllCommentsResponse = function(req, res) {
  console.log('####### > apiMainCtrls.js > getAllCommentsResponse');
  paginate(getQuery(), { sort: sort, limit: 5 }).exec(function (err, results) {
    console.log('####### > apiMainCtrls.js > getAllCommentsResponse > paginate(getQuery');
    var responseBody;
    if (err) {
      sendJSONresponse(res, 404, err);
    } else {
      //console.log('####### > apiMainCtrls.js > getAllCommentsResponse > NOERROR');
      // get next 5 docs ready
      //paginate(getQuery(), {sort: sort,startId: docs[4]._id,startKey: docs[4][sortKey],limit: 5});
      // first 5 docs ready
      sortDocsFrom = 4;
      responseBody = buildGetCommentsResponse(req, res, results);
      console.log('####### > apiMainCtrls.js > getAllCommentsResponse > sendJSONresponse');
      sendJSONresponse(res, 200, responseBody);
    }
  })
};


/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

module.exports.postOneCommentResponse = function(req, res) {
  //console.log('####### > apiMainCtrls.js > electioncommentsCreate 1 ');
  User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    city: req.body.city,
    state: req.body.state,
    candidate: req.body.candidate,
    comment: req.body.comment,
    time: req.body.time,
  }, function(err, electioncomment) {
    if (err) {
      //console.log('####### > apiMainCtrls.js > electioncommentsCreate 2 > Err: ', err);
      //console.log(err);
      sendJSONresponse(res, 400, err);
    } else {
      //console.log('####### > apiMainCtrls.js > electioncommentsCreate 3 > Good: ', electioncomment);
      sendJSONresponse(res, 201, electioncomment);
    }
  });
};


/* GET a location by the id */
module.exports.getOneCommentResponse = function(req, res) {
  //console.log('####### > apiMainCtrls.js > getOneCommentResponse: ', req.params);
  if (req.params && req.params.commentid) {
    User.findById(req.params.commentid).exec(function(err, results) {
        if (!results) {
          sendJSONresponse(res, 404, {"message": "commentid not found"});
        } else if (err) {
          sendJSONresponse(res, 404, err);
        }
        sendJSONresponse(res, 200, results);
      });
  } else {
    //console.log('No commentid specified');
    sendJSONresponse(res, 404, {
      "message": "No commentid in request"
    });
  }
};


/* PUT /api/comments/:commentid */
module.exports.editOneComment = function(req, res) {
  if (!req.params.commentid) {
    sendJSONresponse(res, 404, {
      "message": "Not found, commentid is required"
    });
    return;
  }
  User.findById(req.params.locationid).select('-reviews -rating').exec(function(err, location) {
        if (!location) {
          sendJSONresponse(res, 404, {
            "message": "commentid not found"
          });
          return;
        } else if (err) {
          sendJSONresponse(res, 400, err);
        }
        location.name = req.body.name;
        location.address = req.body.address;
        location.facilities = req.body.facilities.split(",");
        location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
        location.openingTimes = [{
          days: req.body.days1,
          opening: req.body.opening1,
          closing: req.body.closing1,
          closed: req.body.closed1,
        }, {
          days: req.body.days2,
          opening: req.body.opening2,
          closing: req.body.closing2,
          closed: req.body.closed2,
        }];
        location.save(function(err, location) {
          if (err) {
            sendJSONresponse(res, 404, err);
          } else {
            sendJSONresponse(res, 200, location);
          }
        });
      }
  );
};

module.exports.deleteOneComment = function(req, res) {
  var commentsid = req.params.commentsid;
  if (!commentsid) {
    sendJsonResponse(res, 404, {
    "message": "Not found, locationid and reviewid are both required"
  });
    return; 
  }
  
  if (commentsid) {
    User.findByIdAndRemove(commentsid).exec(function(err, comment) {
          if (err) {
            //console.log(err);
            sendJSONresponse(res, 404, err);
          }
          //console.log("Comment id " + commentsid + " deleted");
          sendJSONresponse(res, 204, null);
        }
    );
  } else {
    sendJSONresponse(res, 404, { "message": "No commentid in request" });
  }
};

/* +++++++++++++++++++++++++++++++++++++++++++++++++ */
/* +++++++++++++++++++++++++++++++++++++++++++++++++ */
// 404 = Not Found, Unsuccessful request due to an incorrect parameter in the URL
// 400 = An unsuccessful GET, POST, or PUT request, due to invalid content

/*
USER EXISTS:  { _id: 57c3044ffb8bd1320c6d7338,
  displayname: 'vvvvvvv',
  email: 'vvv@vvv.com',
  password: '$2a$10$Jcg0vWwVE3un0jZuCjidkuH2iG6qqHgKnEGC3Fpuq3X81BVbSGRum',
  __v: 0,
  datecreated: 2016-08-28T15:33:35.029Z }
*/


module.exports.postLoginResponse = function(req, res) {
  console.log('####### > apiMainCtrls.js > postLoginResponse:', req.body.email, ' :: ', req.body.password);

  if(!req.body.email || !req.body.password) {
    console.log('####### > apiMainCtrls.js > postLoginResponse > postLoginResponse1');
    sendJSONresponse(res, 400, { "message": "All fields required" });
    return; 
  }

  var email = req.body.email;
  var password = req.body.password;

  User.findOne({ email: email }, function(err, user) {
    console.log('####### > apiMainCtrls.js > postLoginResponse > User.findOne');

    if (err) {
      console.log('####### > apiMainCtrls.js > postSignUpResponse > User.findOne > ERROR: ', err);
      sendJSONresponse(res, 404, err);
      return;
    } 
    if (!user) {
      console.log('####### > apiMainCtrls.js > postLoginResponse > User.findOne > NO USER: ', user);
      sendJSONresponse(res, 404, { "message": "User not found" });
      return;
    } 
    if(user){
      console.log('####### > apiMainCtrls.js > postLoginResponse > User.findOne > USER EXISTS: ', user);

      
      // http://stackoverflow.com/questions/9291548/how-can-i-find-the-session-id-when-using-express-connect-and-a-session-store
      /*store.get(req.sessionID, function(error, session){
        if(error){
          sendJSONresponse(res, 404, error);
          return;
        }
        console.log('####### > apiMainCtrls.js > postLoginResponse > User.findOne > store.get > session: ', session);
        res.send(session)
      });*/

      /*
      passport.authenticate('login', function(err, user, info){
        if (err) {
          console.log('####### > apiMainCtrls.js > postSignUpResponse > User.findOne > passport.authenticate1');
          sendJSONresponse(res, 404, err);
          return;
        }
        if (!user) { 
          console.log('####### > apiMainCtrls.js > postSignUpResponse > User.findOne > passport.authenticate2');
          sendJSONresponse(res, 401, info);
          return;
        }
        req.logIn(user, function(err) {
          if (err) { 
            console.log('####### > apiMainCtrls.js > postSignUpResponse > User.findOne > passport.authenticate3');
            sendJSONresponse(res, 404, err);
          }
          console.log('####### > apiMainCtrls.js > postSignUpResponse > User.findOne > passport.authenticate4');
          sendJSONresponse(res, 201, user);
        });
      })(req, res);

      */
    }
  });
};


/*
module.exports.postLoginResponse = function(req, res) {
  console.log('####### > apiMainCtrls.js > postLoginResponse:', req.body.email, ' :: ', req.body.password);

  if(!req.body.email || !req.body.password) {
    console.log('####### > apiMainCtrls.js > postLoginResponse > postLoginResponse1');
    sendJSONresponse(res, 400, { "message": "All fields required" });
    return; 
  }

  var email = req.body.email;
  var password = req.body.password;

  User.findOne({ email: email }, function(err, user) {
    console.log('####### > apiMainCtrls.js > postLoginResponse > User.findOne: ', user);

    if (err) {
      console.log('####### > apiMainCtrls.js > postSignUpResponse > User.findOne > ERROR: ', err);
      sendJSONresponse(res, 404, err);
      return;
    } 
    if (!user) {
      console.log('####### > apiMainCtrls.js > postLoginResponse > User.findOne > NO USER: ', user);
      sendJSONresponse(res, 404, { "message": "User not found" });
      return;
    } 
    if(user){
      console.log('####### > apiMainCtrls.js > postLoginResponse > User.findOne > USER EXISTS: ', user);
      sendJSONresponse(res, 201, user);
    }
  });
};
*/


/* +++++++++++++++++++++++++++++++++++++++++++++++++ */
/* +++++++++++++++++++++++++++++++++++++++++++++++++ */

module.exports.postSignUpResponse = function(req, res) {
  console.log('####### > apiMainCtrls.js > postSignUpResponse E/P:', req.body.email, ' :: ', req.body.password);
  
  if (!req.body.displayname || !req.body.email || !req.body.password) {
    console.log('####### > apiMainCtrls.js > postSignUpResponse1');
    sendJSONresponse(res, 400, { "message": "All fields required" });
    return; 
  }
  
  var displayname = req.body.displayname;
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({ email: email }, function(err, user) {
    console.log('####### > apiMainCtrls.js > postSignUpResponse > User.findOne');

    if (err) {
      console.log('####### > apiMainCtrls.js > postSignUpResponse > User.findOne > ERROR: ', err);
      sendJSONresponse(res, 400, err);
      return;
    } 

    // user already exists
    if (user) {
      console.log('####### > apiMainCtrls.js > postSignUpResponse > User.findOne > USER EXISTS: ', user);
      sendJSONresponse(res, 409, { "message": "User already exists" });
      return;
    }

    var newUser = new User({
      displayname: displayname,
      email: email,
      password: password
    });

    newUser.save(function(err, success) {
      console.log('####### > apiMainCtrls.js > postSignUpResponse > User.findOne > newUser.save');

      if (err) {
        console.log('####### > apiMainCtrls.js > postSignUpResponse > User.findOne > newUser.save > ERROR: ', err);
        sendJSONresponse(res, 400, err);
        return;

      } else {
        console.log('####### > apiMainCtrls.js > postSignUpResponse > User.findOne > newUser.save > SAVED');

        passport.authenticate('login', function(err, user, info){
          console.log('####### > apiMainCtrls.js > postSignUpResponse > User.findOne > passport.authenticate1');
          if (err) {
            console.log('####### > apiMainCtrls.js > postSignUpResponse > User.findOne > passport.authenticate2');
            sendJSONresponse(res, 404, err);
            return;
          }
          if (!user) { 
            console.log('####### > apiMainCtrls.js > postSignUpResponse > User.findOne > passport.authenticate3');
            sendJSONresponse(res, 401, info);
            return;
          }
          req.logIn(user, function(err) {
            console.log('####### > apiMainCtrls.js > postSignUpResponse > User.findOne > passport.authenticate > req.logIn');
            if (err) { 
              console.log('####### > apiMainCtrls.js > postSignUpResponse > User.findOne > passport.authenticate > req.logIn > ERR');
              sendJSONresponse(res, 404, err);
              return;
            }
            console.log('####### > apiMainCtrls.js > postSignUpResponse > User.findOne > passport.authenticate > user: ', user)


            if (req.isAuthenticated()) {
              console.log('####### > apiMainCtrls.js > req.isAuthenticated > YES!!: > req.user: ', req.user)
            }


            req.session.save(function (err) {
              if (err) {
                console.log('####### > apiMainCtrls.js > postSignUpResponse > User.findOne > passport.authenticate > req.logIn > req.session.save > ERR');
                sendJSONresponse(res, 404, err);
              }
                console.log('####### > apiMainCtrls.js > postSignUpResponse > User.findOne > passport.authenticate> req.logIn > req.session.save > sendJSONresponse')
                sendJSONresponse(res, 201, user);
            })
            console.log('####### > apiMainCtrls.js > postSignUpResponse > User.findOne > passport.authenticate> req.logIn > sendJSONresponse')
            //sendJSONresponse(res, 201, user);
          });
        })(req, res);

      }
    });
  });
};


/*
module.exports.postSignUpResponse = function(req, res, next) {
  console.log('####### > apiMainCtrls.js > postSignUpResponse U/P1:', req.body.email, ' :: ', req.body.password);
  
  if (!req.body.displayname || !req.body.email || !req.body.password) {
    console.log('####### > apiMainCtrls.js > postSignUpResponse1');
    sendJSONresponse(res, 400, { "message": "All fields required" });
    return; 
  }
  
  var displayname = req.body.displayname;
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({ email: email }, function(err, user) {
    console.log('####### > apiMainCtrls.js > postSignUpResponse > User.findOne');

    if (err) {
      console.log('####### > apiMainCtrls.js > postSignUpResponse > User.findOne > ERROR: ', err);
      sendJSONresponse(res, 400, err);
      return;
    } 

    // user already exists
    if (user) {
      console.log('####### > apiMainCtrls.js > postSignUpResponse > User.findOne > USER EXISTS: ', user);
      sendJSONresponse(res, 409, { "message": "User already exists" });
      return;
    }

    var newUser = new User({
      displayname: displayname,
      email: email,
      password: password
    });

    newUser.save(function(err, success) {
      console.log('####### > apiMainCtrls.js > postSignUpResponse > User.findOne > newUser.save');

      if (err) {
        console.log('####### > apiMainCtrls.js > postSignUpResponse > User.findOne > newUser.save > ERROR: ', err);
        sendJSONresponse(res, 400, err);
        return;

      } else {
        console.log('####### > apiMainCtrls.js > postSignUpResponse > User.findOne > newUser.save > SAVED');
        sendJSONresponse(res, 201, success);
      }

    });
  });
};
*/









