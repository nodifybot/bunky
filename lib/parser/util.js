var
  _ = require("underscore");

exports.regExIt = function(array) {
  return new RegExp(("(" + array.join("|") + ")"), "gi");
}

exports.replace = function(str, pattern) {
  var replacedStr = str.replace(pattern, "");
  return replacedStr.trim();
}


exports.test = function() {
  var newReg = new RegExp(word, "i");
  return newReg.test(this.message);
}

exports.first = function(array) {
  return _(array).first();
}
