/**
 * Parser Module for reading and understanding sentence
 */

var
  _ = require("underscore");

/**
 * Text constructor.
 *
 * @param {String} message.
 */
function Text(message) {
  this._omessage = message;
  this.analyze(message);
}

/**
 * trim sentence, split into array store them in words
 * strip out @bot out of original sentence
 *
 * @param  {String} sentence user as
 */
Text.prototype.analyze = function(sentence) {
  //remove @bot from message
  this._message = sentence.replace("@bot", "");
  //splits based on whitespace
  var unprocossedWord = this._message.split(/\s+/);
  //strips out all non words and store them
  this._words = _(unprocossedWord).chain().map(function(word) {
    return word.toLowerCase().replace(/\.$/, "");
  }).compact().value();
  //recreate string
  this._message = this._words.join(" ");
}


//export module
module.exports = Text;
