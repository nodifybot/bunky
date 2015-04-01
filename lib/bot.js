/**
 * Bot Interface
 */

var
  Promise = require("bluebird"),
  _ = require("underscore"),
  mongoose = require('mongoose'),
  Expense = mongoose.model('Expense'),
  Member = mongoose.model('Member'),
  Parser = require("./parser/"),
  sendMail = require("./send-mail"),
  report = require("./report");

//export various method
module.exports = Promise.method(function(to, from, message) {
  var parser = new Parser(message);
  var action = parser.action();

  switch (action) {
    case "addt":
      var data = parser.build(from);
      return new Promise(function(resolve, reject) {
        Member.findByPaidId(data)
          .then(function(result) {
            _.extend(result, {
              date: data.dateValue || new Date(),
              description: message
            });
            return Expense.credit(result);
          })
          .then(function(result) {
            resolve("transaction recorded.");
          })
          .catch(function(err) {
            reject(err);
          });
      });
      break
    case "addm":
      var member = parser.member(message);
      return Member.addMember(member);
      break;
    case "mail":
      var name = parser.member(message).name;
      var month = parser.date().month();
      return sendMail.sendReport(name, month);
      break
    case "export":
      throw new Error("not implemented yet");
      break
    case "report":
      var month = parser.date().month();
      return report.getReportByMonth(month);
      break
    default:
      throw new Error("No Command found");
  }
})
