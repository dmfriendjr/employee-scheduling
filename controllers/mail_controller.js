'use strict';
const nodemailer = require('nodemailer');
const moment = require('moment-timezone');

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'xkl5o2ajf4fqdv26@ethereal.email',
    pass: '3nVUe6PB5heSz1E6p2'
  }
});

module.exports = {
  sendVerificationEmail: function (email, username, token) {
    let mailOptions = {
      from: '"Employee Scheduler" <foo@example.com>', 
      to: email, 
      subject: 'Scheduling App - Account Verification', 
      text: `https://employease.herokuapp.com/verify/${username}/${token}`, 
      html: `<a href="https://employease.herokuapp.com/verify/${username}/${token}` 
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
    });
  },

  sendResetPasswordEmail: function(email, username, token) {
    let mailOptions = {
      from: '"Employee Scheduler" <foo@example.com>', 
      to: email, 
      subject: 'Scheduling App - Reset Password', 
      text: `https://employease.herokuapp.com/reset/${username}/${token}`, 
      html: `<a href="https://employease.herokuapp.com/reset/${username}/${token}`  
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return console.log(error);
      }
    });
  },

  sendScheduleEmails: function(email, shifts) {
    let emailText = (function(shiftData) {
      let fullText = '<h1>Your Schedule</h1>';

      shiftData.map(shift => {
        fullText += `<p>${shift.shiftTitle}: ${moment(shift.shiftStart).format('LLLL')} until ${moment(shift.shiftEnd).format('LLLL')}</p>`;
      });
      
      return fullText;
    })(shifts);

    let mailOptions = {
      from: '"Employee Scheduler" <foo@example.com>', 
      to: email, 
      subject: 'Your Schedule', 
      text: emailText, 
      html: emailText 
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return console.log(error);
      }
    });
  }
};