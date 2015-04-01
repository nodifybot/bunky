// Expence Model

var
  Promise = require("bluebird"),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  _ = require("underscore");

var ExpenseSchema = new Schema({
  amount: 'Number',
  paid_by: {
    type: Schema.Types.ObjectId,
    ref: 'Member'
  },
  paid_for: [{
    type: Schema.Types.ObjectId,
    ref: 'Member'
  }],
  date: {
    type: Date,
    default: Date.now
  },
  description: 'String'
});

ExpenseSchema.statics.credit = function(exp) {
  return new Promise(function(resolve, reject) {
    Expense = mongoose.model('Expense');
    var expense = new Expense(exp);
    expense.save(function(err, result) {
      if (err) reject(err);
      resolve(true);
    });
  });
};

ExpenseSchema.statics.findByMonth = function(month) {
  return new Promise(function(resolve, reject) {
    Expense = mongoose.model('Expense');
    Expense.find({
      $where: 'this.date.getMonth() === ' + month
    }, function(err, expenses) {
      if (err) reject(err);
      Expense.populate(expenses, [{
        path: 'paid_by'
      }, {
        path: 'paid_for'
      }], function(err, result) {
        if (err) reject(err);
        result = _(result).chain().map(function(data) {
          return {
            paid_by: data.paid_by.name,
            paid_for: _(data.paid_for).pluck("name"),
            amount: data.amount
          }
        }).groupBy("paid_by").value();
        resolve(result)
      })
    })
  });
}

ExpenseSchema.statics.findDebitByUsername = function(name) {

}



mongoose.model('Expense', ExpenseSchema);
