var nodemailer = require('nodemailer');

// returns the current working directory of the Node.js process.

var EMAIL_ACCOUNT_USER = 'your@email.address';
var EMAIL_ACCOUNT_PASSWORD = 'your-password'
var YOUR_NAME = 'Your Name';

var smtpTransport = nodemailer.createTransport('SMTP',{
    service: 'Gmail',
    auth: {
      user: EMAIL_ACCOUNT_USER,
      pass: EMAIL_ACCOUNT_PASSWORD
    }
});

exports.sendMail = function(fromAddress, toAddress, subject, content, next){
  var success = true;
  var mailOptions = {    from: YOUR_NAME + ' <' + fromAddress + '>',
    to: toAddress,
    replyTo: fromAddress,
    subject: subject,
    html: content
  };

  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
      console.log('[ERROR] Message NOT sent: ', error);
      success = false;
    }
    else {
      console.log('[INFO] Message Sent: ' + response.message);
    }
    next(error, success);
  });
};