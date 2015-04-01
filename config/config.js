/**
 * Configuration file
 */

var path = require('path'),
  rootPath = path.normalize(__dirname + '/..'),
  env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'bounty-irc-expenses'
    },
    port: 3000,
    db: 'mongodb://localhost:27017/bounty-irc-expenses-development',
    irc: {
      server: 'chat.freenode.net',
      port: 8001,
      channels: ["#expence-manager"],
      name: "embot",
      debug: true
    },
    email: "example@gmail.com"
  },

  heroku: {
    root: rootPath,
    app: {
      name: 'bounty-irc-expenses'
    },
    port: process.env.PORT || 5000,
    db: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://ds041821.mongolab.com:41821/heroku_app34657657',
    irc: {
      server: 'chat.freenode.net',
      port: 8001,
      channels: ["#bounty-irc-expenses"],
      name: "bountybot",
      debug: true
    },
    email: "bountybot@gmail.com"
  },

  test: {
    root: rootPath,
    app: {
      name: 'bounty-irc-expenses'
    },
    port: 3000,
    db: 'mongodb://localhost/bounty-irc-expenses-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'bounty-irc-expenses'
    },
    port: 3000,
    db: 'mongodb://localhost/bounty-irc-expenses-production'
  }
};

module.exports = config[env];
