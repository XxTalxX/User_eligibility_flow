const nodeMailer = require('nodemailer');

let transporter = nodeMailer.createTransport({
  host: 'smtp.freesmtpservers.com',
  secure: false,
  port: 25,
  auth: null
});

function sendMail(to, subject, text) {
    
    const mailOptions = {
        from: process.env.EMAIL, // sender address
        to: to,
        subject: subject, // Subject line
        html: text, // plain text body
       };

     return transporter.sendMail(mailOptions).then(sentMail => {
        console.log(sentMail.envelope);
        console.log(sentMail.messageId);
      }).catch(err => {
        console.log(err);
        return err;
      })
  }


exports.sendMail = sendMail

