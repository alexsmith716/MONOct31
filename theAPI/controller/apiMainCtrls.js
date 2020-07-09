
// 200: OK, A successful GET or PUT request
// 201: Created, A successful POST request
// 204: No Content, A successful DELETE request
// 400: Bad Request, An unsuccessful GET, POST, or PUT request, due to invalid content
// 401: Unauthorized, Requesting a restricted URL with incorrect credentials
// 404: Not Found, Unsuccessful request due to an incorrect parameter in the URL

var passport = require('passport');
var User = require('../model/userSchema.js');
var Comment = require('../model/commentsSchema.js');
var paginate = require('mongoose-range-paginate');
var nodemailer = require('nodemailer');
var sortKey = 'time'
var sort = '-' + sortKey
var sortDocsFrom = 0;

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

module.exports.getIndexResponse = function(req, res) {
  console.log('####### > apiMainCtrls.js > getIndexResponse > GOOD 200');
  sendJSONresponse(res, 200), { "message": "getIndexResponse Response!!!" };
};

/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/*
  "_id" : ObjectId("58077566106e9eb4029468f7"),
  "displayname" : "homerNYC123",
  "id" : "58076bd3bb2924500200175c",
  "city" : "St. Louis",
  "state" : "{\"full\":\"District Of Columbia\",\"initials\":\"DC\"}",
  "candidate" : "Donald Trump",
  "comment" : "Svfdvdfvdfvfvf. Ncdcdscscsdcdc. Ycsdcscdscsdcdscd. Tdvvffdvffdvdfv.",
  "subComments" : [ ],
  "datecreated" : ISODate("2016-10-19T13:30:14.461Z"),

              - var id= doc.id
              - var displayname= doc.displayname
              - var city= doc.city
              - var state= doc.state
              - var cityState= ", " + city + ", " + state
              - var candidate= doc.candidate
              - var comment= doc.comment
              - var recommended= doc.recommended

            <!--each doc in responseBody-->
            - for(var doc in responseBody)
            
              p= doc
              p= responseBody[doc]

*/

var buildGetCommentsResponse = function(req, res, results) {
  var responseBody = [];
  results.forEach(function(doc) {
      console.log('####### > apiMainCtrls.js > buildGetCommentsResponse1: ', doc.displayname);
      console.log('####### > apiMainCtrls.js > buildGetCommentsResponse1: ', doc.commenterId);
      console.log('####### > apiMainCtrls.js > buildGetCommentsResponse1: ', doc.city);
      console.log('####### > apiMainCtrls.js > buildGetCommentsResponse1: ', doc.state.full);
      console.log('####### > apiMainCtrls.js > buildGetCommentsResponse1: ', doc.datecreated);
      console.log('####### > apiMainCtrls.js > buildGetCommentsResponse1: ', doc.candidate);
      console.log('####### > apiMainCtrls.js > buildGetCommentsResponse1: ', doc.comment);
      console.log('####### > apiMainCtrls.js > buildGetCommentsResponse1: ', doc.recommended);
    responseBody.push({
      id: doc._id,
      displayname: doc.displayname,
      commenterId: doc.commenterId,
      city: doc.city,
      state: doc.state.full,
      datecreated: doc.datecreated,
      candidate: doc.candidate,
      comment: doc.comment,
      recommended: doc.recommended,
      subComments: doc.subComments
    });
  });
  return responseBody;
};


/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

function getQuery() {
  return Comment.find()
    .where({})
}

module.exports.getCommentsResponse = function(req, res) {
  console.log('####### > apiMainCtrls.js > getAllCommentsResponse');
  console.log('####### > apiMainCtrls.js > getAllCommentsResponse > req.session.paginateFrom: ', req.session.paginateFrom)
  paginate(getQuery(), { sort: sort, limit: 5 }).exec(function (err, results) {
    console.log('####### > apiMainCtrls.js > getAllCommentsResponse > paginate(getQuery');
    var responseBody;
    if (err) {
      console.log('####### > apiMainCtrls.js > getAllCommentsResponse > paginate(getQuery > ERROR!: ', err);
      sendJSONresponse(res, 404, err);
    } else {
      // get next 5 docs ready
      //paginate(getQuery(), {sort: sort,startId: docs[4]._id,startKey: docs[4][sortKey],limit: 5});
      // first 5 docs ready
      sortDocsFrom = 4;
      //sortDocsFrom = 13;
      responseBody = buildGetCommentsResponse(req, res, results);
      console.log('####### > apiMainCtrls.js > getAllCommentsResponse > sendJSONresponse > responseBody: ', responseBody);
      //console.log('####### > apiMainCtrls.js > getAllCommentsResponse > sendJSONresponse > responseBody99: ', responseBody);
      sendJSONresponse(res, 200, responseBody);
    }
  })
};

/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */


module.exports.getUserProfileResponse = function(req, res) {
  console.log('####### > apiMainCtrls.js > getUserProfileResponse', req.params.userid);
  if (req.params && req.params.userid) {
    User.findById(req.params.userid).exec(function(err, user) {
        if (!user) {
          console.log('####### > apiMainCtrls.js > getUserProfileResponse > !USER');
          sendJSONresponse(res, 404, { "message": "userid not found" });
          return;
        } else if (err) {
          console.log('####### > apiMainCtrls.js > getUserProfileResponse > ERROR');
          sendJSONresponse(res, 404, err);
          return;
        }
        console.log('####### > apiMainCtrls.js > getUserProfileResponse > GOOD 200');
        console.log('####### > apiMainCtrls.js > getUserProfileResponse > FROM API > user: ', user);
        console.log('####### > apiMainCtrls.js > getUserProfileResponse > FROM API > typeof user: ', typeof user);
        /*var z;
        for (z in user) {
          console.log('####### > apiMainCtrls.js > getUserProfileResponse > Z: ', typeof z, " ::: ", z);
        }*/
        sendJSONresponse(res, 200, user);
      });
  } else {
    console.log('####### > apiMainCtrls.js > getUserProfileResponse > No userid specified');
    sendJSONresponse(res, 404, { "message": "No userid in request" });
  }
};

/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
var doAddComment = function(req, res, location, author) {
  if (!location) {
    sendJSONresponse(res, 404, "locationid not found");
  } else {
    location.reviews.push({
      author: author,
      rating: req.body.rating,
      reviewText: req.body.reviewText
    });
    location.save(function(err, location) {
      var thisReview;
      if (err) {
        sendJSONresponse(res, 400, err);
      } else {
        updateAverageRating(location._id);
        thisReview = location.reviews[location.reviews.length - 1];
        sendJSONresponse(res, 201, thisReview);
      }
    });
  }
};

module.exports.postMainCommentResponse = function(req, res) {
  console.log('####### > apiMainCtrls.js > postMainCommentResponse');
  Comment.create({
    displayname: req.body.displayname,
    commenterId: req.body.commenterId,
    city: req.body.city,
    state: req.body.state,
    candidate: req.body.candidate,
    comment: req.body.comment
  }, function(err, electioncomment) {
    if (err) {
      console.log('####### > apiMainCtrls.js > postMainCommentResponse > Error: ', err);
      sendJSONresponse(res, 400, err);
    } else {
      console.log('####### > apiMainCtrls.js > postMainCommentResponse > Good: ', electioncomment);
      sendJSONresponse(res, 201, electioncomment);
    }
  });
};

/*
{ displayname: 'aaa123',
  commenterId: '580771261928bc6e024bb08c',
  city: 'Cccccc',
  state: { full: 'Mississippi', initials: 'MS' },
  comment: 'Zsdvsdvdvsdvdsvsddsvsdv2222' }
*/

module.exports.postSubCommentResponse = function(req, res) {
  console.log('####### > apiMainCtrls.js > postSubCommentResponse > req.params.subcommentid:', req.params.subcommentid);
  if (!req.params.subcommentid) {
    console.log('####### > apiMainCtrls.js > postSubCommentResponse > !req.params.subcommentid');
    sendJSONresponse(res, 404, { message: "subcommentid not found" });
    return; 
  }
  Comment.findById(req.params.subcommentid).select('subComments').exec(function(err, comment) {
    console.log('####### > apiMainCtrls.js > postSubCommentResponse > Comment.findById1');
    if (err) {
      console.log('####### > apiMainCtrls.js > postSubCommentResponse > Comment.findById2', err);
      sendJSONresponse(res, 400, err);
    }else{
      console.log('####### > apiMainCtrls.js > postSubCommentResponse > Comment.findById3', comment);
      comment.subComments.push({
        displayname: req.body.displayname,
        commenterId: req.body.commenterId,
        city: req.body.city,
        state: req.body.state,
        comment: req.body.comment
      });
      comment.save(function(err, comment) {
        var newComment;
        if (err) {
          console.log('####### > apiMainCtrls.js > postSubCommentResponse > Comment.findById > SAVE ERROR: ', err);
          sendJSONresponse(res, 400, err);
        } else {
          newComment = comment.subComments[comment.subComments.length - 1];
          console.log('####### > apiMainCtrls.js > postSubCommentResponse > Comment.findById > SAVE SUCCESS: ', newComment);
          sendJSONresponse(res, 201, newComment);
        }
      });
    }
  });
};



var getCommentUser = function(req, res, callback) {
  console.log("Finding author with email " + req.payload.email);
  if (req.payload.email) {
    User.findOne({ email : req.payload.email }).exec(function(err, user) {
        if (!user) {
          sendJSONresponse(res, 404, {
            "message": "User not found"
          });
          return;
        } else if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }
        console.log(user);
        callback(req, res, user.name);
      });
  } else {
    sendJSONresponse(res, 404, {
      "message": "User not found"
    });
    return;
  }
};
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

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
  //
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
        - if (error === "400")
          .alert.alert-danger(role="alert") All fields are required, please try again
        - if (error === "404")
          .alert.alert-danger(role="alert") Login failed. Confirm email and password and try again.
        - if (error === "401")
          .alert.alert-danger(role="alert") Please login or sign up.
*/

module.exports.postResetPasswordResponse = function(req, res) {
  console.log('####### > apiMainCtrls.js > postResetPasswordResponse > email:', req.body.email);

  if(!req.body.email) {
    console.log('####### > apiMainCtrls.js > postResetPasswordResponse > postResetPasswordResponse1');
    sendJSONresponse(res, 400, { "message": "All fields required" });
    return; 
  }

  User.findOne({ email: req.body.email }, function(err, user) {
    console.log('####### > apiMainCtrls.js > postResetPasswordResponse > User.findOne');
    if (err) {
      console.log('####### > apiMainCtrls.js > postResetPasswordResponse > User.findOne > ERROR: ', err);
      sendJSONresponse(res, 400, err);
      return;
    } 
    if (!user || user === null) {
      console.log('####### > apiMainCtrls.js > postResetPasswordResponse > User.findOne > NO USER: ', err);
      sendJSONresponse(res, 400, user);
      return;

    } else {
      console.log('####### > apiMainCtrls.js > postResetPasswordResponse > User.findOne > USER EXISTS: ', user);
      sendJSONresponse(res, 201, user);
    }
  });
};


module.exports.putUserProfileResponse = function(req, res) {
  console.log('####### > apiMainCtrls.js > putUserProfileResponse > req.session: ', req.session);
  console.log('####### > apiMainCtrls.js > putUserProfileResponse > req.params.userid: ', req.params.userid);
  if (!req.params.userid) {
    sendJSONresponse(res, 404, { "message": "All fields required" });
    return;
  }
  User.findById(req.params.userid).exec(function(err, user) {
    console.log('####### > apiMainCtrls.js > putUserProfileResponse > User.findOne');
    if (err) {
      console.log('####### > apiMainCtrls.js > putUserProfileResponse > User.findOne > ERROR: ', err);
      sendJSONresponse(res, 400, err);
      return;
    } 
    if (!user || user === null) {
      console.log('####### > apiMainCtrls.js > putUserProfileResponse > User.findOne > NO USER: ', err);
      sendJSONresponse(res, 404, user);
      return;
    }

    var reqBodyKey, reqBodyValue;
    for (var z in req.body){
      reqBodyKey = z;
      reqBodyValue = req.body[z];
      console.log('####### > apiMainCtrls.js > putUserProfileResponse > User.findOne > KEY/VALUE: ', reqBodyKey, " :: ", reqBodyValue);
    }

    var objKey = Object.keys(req.body)
    console.log('####### > apiMainCtrls.js > putUserProfileResponse > User.findOne > objKey: ', objKey);

    user[objKey] = reqBodyValue;

    user.save(function(err, success) {
      console.log('####### > apiMainCtrls.js > putUserProfileResponse > User.findOne > USER EXISTS > user.save');
      if (err) {
        console.log('####### > apiMainCtrls.js > putUserProfileResponse > User.findOne > USER EXISTS > user.save > ERROR');
        sendJSONresponse(res, 404, err);
      } else {
        console.log('####### > apiMainCtrls.js > putUserProfileResponse > User.findOne > USER EXISTS > user.save > SUCCESS');
        sendJSONresponse(res, 200, success);
      }
    });
  });
};




module.exports.postLoginResponse = function(req, res) {
  console.log('####### > apiMainCtrls.js > postLoginResponse:', req.body.email, ' :: ', req.body.password);

  if(!req.body.email || !req.body.password) {
    console.log('####### > apiMainCtrls.js > postLoginResponse > postLoginResponse1');
    sendJSONresponse(res, 400, { "message": "All fields required" });
  }else{
    User.findOne({ email: req.body.email }, function(err, user) {
      console.log('####### > apiMainCtrls.js > postLoginResponse > User.findOne');
      if (err) {
        console.log('####### > apiMainCtrls.js > postLoginResponse > User.findOne > ERROR: ', err);
        sendJSONresponse(res, 400, err);
        return;
      } 
      if (!user || user === null) {
        console.log('####### > apiMainCtrls.js > postLoginResponse > User.findOne > NO USER404 > err: ', err);
        console.log('####### > apiMainCtrls.js > postLoginResponse > User.findOne > NO USER404 > user: ', user);
        sendJSONresponse(res, 404, user);
        return;
      }
      console.log('####### > apiMainCtrls.js > postLoginResponse > User.findOne > USER EXISTS: ', user);
      sendJSONresponse(res, 201, user);
    });
  }
};

/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

module.exports.updateUserResponse = function(req, res) {
  console.log('####### > apiMainCtrls.js > updateUserResponse');
  if (!req.params.userid) {
    sendJSONresponse(res, 404, { "message": "All fields required" });
    return;
  }
  //User.findById(req.params.userid, function(err, user) {
  User.findById(req.params.userid).exec(function(err, user) {
    console.log('####### > apiMainCtrls.js > updateUserResponse > User.findOne');
    if (err) {
      console.log('####### > apiMainCtrls.js > updateUserResponse > User.findOne > ERROR: ', err);
      sendJSONresponse(res, 400, err);
      return;
    } 
    if (!user || user === null) {
      console.log('####### > apiMainCtrls.js > updateUserResponse > User.findOne > NO USER: ', err);
      sendJSONresponse(res, 404, user);
      return;
    }
    console.log('####### > apiMainCtrls.js > updateUserResponse > User.findOne > USER EXISTS: ', user);
    user.previouslogin = user.lastlogin;
    user.lastlogin = new Date();
    user.save(function(err, success) {
      if (err) {
        console.log('####### > apiMainCtrls.js > updateUserResponse > User.findOne > USER EXISTS > user.save > ERROR');
        sendJSONresponse(res, 404, err);
      } else {
        console.log('####### > apiMainCtrls.js > updateUserResponse > User.findOne > USER EXISTS > user.save > SUCCESS');
        sendJSONresponse(res, 200, success);
      }
    });
  });
};

/* +++++++++++++++++++++++++++++++++++++++++++++++++ */
/* +++++++++++++++++++++++++++++++++++++++++++++++++ */


module.exports.postSignUpResponse = function(req, res) {
  console.log('####### > apiMainCtrls.js > postSignUpResponse (email/pass):', req.body.email, ' :: ', req.body.displayname, ' :: ', req.body.password);

  if (!req.body.email || !req.body.displayname || !req.body.password || !req.body.firstname || !req.body.lastname || !req.body.city || !req.body.state) {
    console.log('####### > apiMainCtrls.js > postSignUpResponse1');
    sendJSONresponse(res, 400, { message: "All fields required" });
    return; 
  }

  User.findOne({ email: req.body.email }, function(err, user) {

    console.log('####### > apiMainCtrls.js > postSignUpResponse > email > User.findOne');

    if (err) {
      console.log('####### > apiMainCtrls.js > postSignUpResponse > email > User.findOne > 400 ERROR: ', err);
      sendJSONresponse(res, 400, err);
      return;
    }

    if (user) {
      console.log('####### > apiMainCtrls.js > postSignUpResponse > User.findOne > email > USER ALREADY EXISTS: ', user);
      sendJSONresponse(res, 409, { "message": "Please use a different email address." });
      return;
    }

    if (!user) {
      console.log('####### > apiMainCtrls.js > postSignUpResponse > User.findOne > NO USER DOING USERSAVE: ', user);
      console.log('####### > apiMainCtrls.js > postSignUpResponse > User.findOne > req.body.password: ', req.body.password);

      var newUser = new User();
      newUser.displayname = req.body.displayname;
      newUser.email = req.body.email;
      newUser.firstname = req.body.firstname;
      newUser.lastname = req.body.lastname;
      newUser.city = req.body.city;
      newUser.state = req.body.state;
      newUser.setPassword(req.body.password);

      newUser.save(function(err, result) {
        // failed save attempt is a (err) / 400
        console.log('####### > apiMainCtrls.js > postSignUpResponse > newUser.save');
        
        // Validation Error
        if (err) {
          console.log('####### > apiMainCtrls.js > postSignUpResponse > newUser.save > 400 ERROR: ', err);
          sendJSONresponse(res, 400, err);
  
        } else {
          console.log('####### > apiMainCtrls.js > postSignUpResponse > newUser.save > SAVED > sendJSONresponse 201');
          sendJSONresponse(res, 201, result);
        }
  
      });
    }
  });
};


