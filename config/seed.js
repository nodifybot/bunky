var mongoose = require('mongoose'),
  Member = mongoose.model('Member');

//seed file to populate uses
module.exports = function() {
  Member.find({}, function(err, members) {
    if (err) console.log(err);
    if (members.length < 4) {
      Member.create([{
        name: "sameer",
        nick: "sam",
        email: "sameer@yopmail.com"
      }, {
        name: "shubham",
        nick: "shub",
        email: "shubham@yopmail.com"
      }, {
        name: "kaushik",
        nick: "kush",
        email: "kaushik@yopmail.com"
      }, {
        name: "dilip",
        nick: "dilip",
        email: "dilip@yopmail.com"
      }], function(err, member) {
        if (err) console.log(err);
        console.log(member);
      });
    }
  });
};
