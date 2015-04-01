/**
 * IRC bot communication
 */

var
  irc = require('irc'),
  exec = require("../lib/bot"),
  man = require("../lib/commands");

module.exports = function(config) {

  var bot = new irc.Client(config.irc.server, config.irc.name, {
    channels: config.irc.channels,
    port: config.irc.port,
    debug: config.irc.debug
  });

  bot.addListener('message', function(from, to, message) {
    if ((/@bot/).test(message) && message.indexOf('!help') === -1) {
      message = message.split("@bot")[1].trim();
      exec(to, from, message)
        .then(function(result) {
          bot.say(to, result);
        })
        .catch(function(err) {
          bot.say(to, err);
        });
    }
  });

  bot.addListener('message', function(from, to, message) {
    if ((/@bot/).test(message)) {
      var data = "All Command Should start with my name i.e. @bot";
      man.forEach(function(com) {
        data += (com.name + "----\t---" + com.man + "\n")
      })
      if (message.indexOf('!help') > -1) {
        bot.say(to, data);
      }
    }
  });

  bot.on("error", function(err) {
    console.log(err)
  });

  return bot;
}
