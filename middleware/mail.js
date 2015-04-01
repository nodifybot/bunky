var nodemailer = require('nodemailer'),
  path = require('path'),
  templatesDir = path.join(__dirname, '../public/templates'),
  emailTemplates = require('email-templates'),
  Promise = require("bluebird"),
  config = require("../config/config");

module.exports = function(to, text) {
  return new Promise(function(resolve, reject) {
    var transporter = nodemailer.createTransport();
    transporter.sendMail({
      from: config.email,
      to: to,
      subject: 'Report',
      text: text
    }, function(err, result) {
      if (err) reject(err);
      resolve("Mail Sent");
    });
  });
}
