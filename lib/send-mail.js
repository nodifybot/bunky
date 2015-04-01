var
  Mailer = require('../middleware/mail.js'),
  Promise = require("bluebird"),
  mongoose = require('mongoose'),
  Member = mongoose.model('Member'),
  report = require("./report");


exports.sendReport = function(name, month) {
  return new Promise(function(resolve, reject) {
    Member.find({
      name: name
    }, function(err, member) {
      if (err) reject(err);
      report.filterByName(month, member[0].name)
        .then(function(str) {
          return Mailer(member[0].email, str)
        })
        .then(function(result) {
          resolve("email sent");
        })
        .catch(function(err) {
          reject(err);
        });
    })
  });
};
