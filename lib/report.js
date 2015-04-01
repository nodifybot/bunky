/**
 * Report module
 *
 */
var
  mongoose = require('mongoose'),
  Expense = mongoose.model('Expense'),
  Member = mongoose.model('Member'),
  _ = require('underscore'),
  Promise = require("bluebird"),
  config = require("../config/config");


//total expense done in month
var showReport = function(data) {
  var totalAmount = 0;
  for (var key in data) {
    var user = data[key]
    totalAmount += _(user).reduce(function(acc, v) {
      return acc + (v.amount * v.paid_for.length)
    }, 0)
  }
  return "Total Expenditure for month is : " + Math.round(totalAmount) + "\u0020\u0020";
}

//status among each member
var expenseStatus = function(data) {
  var statics = {};
  for (var key in data) {
    var user = data[key]
    _(user).each(function(v) {
      _(v.paid_for).each(function(k) {
        if (v.paid_by !== k && v.paid_by && k) {
          var key = v.paid_by + "-" + k;
          var due = statics[key] || 0
          statics[key] = Math.round(v.amount) + due;
          var creditParty = key.split("-").reverse().join("-")
          var credit = statics[creditParty] || 0;
          if (credit) {
            if (statics[creditParty]) {
              statics[creditParty] = statics[creditParty] - statics[key];
            }
          }
          statics[key] -= credit;
        }
      })
    })
  }
  return statics;
}

module.exports = {
  //fetch report based on month
  //calculte expence done by each roomie
  getReportByMonth: function(month) {
    return new Promise(function(resolve, reject) {
      Expense.findByMonth(month)
        .then(function(result) {
          var str = "";
          str += showReport(result);
          var expenses = expenseStatus(result);
          for (var k in expenses) {
            str += ["\u000A", k, "\u0020\u0020[[", expenses[k], "]]\u0020\u0020"].join("");
          }
          resolve(str);
        })
        .catch(function(err) {
          reject("Not able to genrate report at this moment");
        });
    });
  },
  //fetch report by month and name
  filterByName: function(month, name) {
    return new Promise(function(resolve, reject) {
      Expense.findByMonth(month)
        .then(function(result) {
          var str = "";
          var reg = new RegExp(name, "g");
          var expenses = expenseStatus(result);
          for (var k in expenses) {
            if (reg.test(k)) {
              str += ["\u000A", k, "\u0020\u0020[[", expenses[k], "]]\u0020\u0020"].join("");
            }
          }
          if (str) {
            resolve(str);
          } else {
            reject("No debit or credit on User")
          }
        })
        .catch(function(err) {
          reject("Not able to genrate report at this moment");
        });
    })
  },

  //genrate report for web, calculate expence done by each member in that month
  getCurrentYear: Promise.method(function(year, month) {
    return new Promise(function(resolve, reject) {
      Expense.findByMonth(month)
        .then(function(data) {
          var obj = {};
          for (var key in data) {
            var user = data[key]
            _.each(user, function(u) {
              obj[key] = (obj[key] || 0) + u.amount * u.paid_for.length
            })
          }
          resolve(obj);
        })
        .catch(function(err) {
          reject("Not able to genrate report at this moment");
        });
    })
  })
}
