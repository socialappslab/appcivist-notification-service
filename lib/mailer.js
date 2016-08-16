//
//This module almost entirely from:
//http://blog.ragingflame.co.za/2013/2/14/roll-out-your-own-uptime-monitor-with-nodejs
//

var nodemailer = require('nodemailer'),
    config = require('./config');


exports.mailerStub = function (opts) {
  console.log('Here are the opts', opts);
}

exports.sendMail = function (opts) {
    var mailOpts, smtpTransport;

    console.log ('Creating Transport');

    var smtpTransport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: config.email,
                pass: config.password
            }
        });
    
    //Message object
    var message = {
        from: opts.from,
        replyTo: opts.from,
        to: opts.to,
        subject: opts.subject,
        html: opts.body
    };

    console.log('mailOpts: ', mailOpts);

    console.log('Sending Mail');
    // Send mail
    smtpTransport.sendMail(message, function (error, info) {
      if (error) {
        console.log(error);
      }else {
        console.log('Message sent successfully!');
        console.log('Server responded with "%s"', info.response);
      }
    console.log('Closing Transport');
    smtpTransport.close();
    });
   
}