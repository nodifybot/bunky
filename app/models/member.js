// Member Model

var
  Promise = require("bluebird"),
  _ = require("underscore"),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var MemberSchema = new Schema({
  name: 'String',
  nick: 'String',
  email: 'String'
});

MemberSchema.statics.addMember = function(member) {
  Member = mongoose.model('Member');
  return new Promise(function(resolve, reject) {
    Member.findOne({
      name: member.name
    }).exec()
      .then(function(members) {
        if (!members) {
          var newMember = new Member(member);
          newMember.save(function(err, members) {
            if (err) reject("member already exist");
            resolve(member.name + " created");
          })
        } else {
          reject("Member already exist");
        }
      }, function(err) {
        reject(err);
      });
  });
}

MemberSchema.statics.findByPaidId = function(data) {
  return new Promise(function(resolve, reject) {
    Member = mongoose.model('Member');
    Member.find({}).exec()
      .then(function(members) {
        console.log(members);
        if (!members.length) {
          reject("transaction not recoded, because " + data.paidFor + " is not a registerted member")
        }

        var paidBy = _(members).find(function(member) {
          return member.name === data.paidBy;
        });

        console.log(paidBy);

        if (!paidBy) {
          reject("transaction not recoded, because " + data.paidBy + " is not a registerted member")
        }
        if (data.paidFor === "all") {
          var paidFor = _(members).chain()
            .filter(function(member) {
              return member.name !== data.paidBy;
            })
            .pluck("_id")
            .value();
        } else {
          var paidFor = _(members).chain()
            .filter(function(member) {
              return member.name === data.paidFor;
            })
            .pluck("_id")
            .value();
        }

        console.log(paidFor);

        if (!paidFor) {
          reject("transaction not recoded, because user is not a registerted member")
        }
        var share = data.amount / members.length;
        resolve({
          amount: share,
          paid_for: paidFor,
          paid_by: paidBy
        })
      })
  })
}

mongoose.model('Member', MemberSchema);
