var
  expect = require('chai').expect,
  Parser = require("../lib/parser/")


describe("Parser test", function() {

  console.log(Parser)

  describe("Parser#contructor", function() {
    var parser;
    beforeEach(function() {
      var message = "@bot addt paid 600 for dinner yesterday. @all"
      parser = new Parser(message);
    });

    it("should be instance of Parser", function() {
      expect(parser).to.be.an.instanceof(Parser);
    });

    it("should have _text property", function() {
      expect(parser).to.have.ownProperty('_text');
    });

  });

  describe("Parser.action()", function() {
    it("should genrate action", function() {
      var message = "@bot addt paid 600 for dinner yesterday. @all"
      var parser = new Parser(message);
      expect(parser.action()).to.be.equal("addt");
    });

    it("test for addm along with email", function() {
      var message = "@bot addm new @shrivatsa shrivatsa@yopmail.com"
      var parser = new Parser(message);
      expect(parser.action()).to.be.equal("addm");
    });

    it("should genrate action", function() {
      var message = "@bot addt paid 600 for dinner addm yesterday. @all"
      var parser = new Parser(message);
      expect(parser.action.bind(parser)).to.throw(/Multiple command found in sentence/)
    });
  });

  describe("Parser.user()", function() {
    it("should search user", function() {
      var message = "@bot addt paid 600 for dinner yesterday. @all"
      var parser = new Parser(message);
      expect(parser.user()).to.be.equal("all");
    });

    it("should update sentence", function() {
      var message = "@bot addt paid 600 for dinner yesterday. @all"
      var parser = new Parser(message);
      parser.user();
      expect(parser._message).to.be.equal("addt paid 600 for dinner yesterday all");
    });

    it("should throw an error", function() {
      var message = "@bot addt paid 600 for dinner yesterday. @all @yash"
      var parser = new Parser(message);
      expect(parser.user.bind(parser)).to.throw(/User not found either, or wrong command use type/);
    });
  });

  describe("Parser.member()", function() {
    it("should search member", function() {
      var message = "@bot addm new @Shrivatsa Shrivatsa@gmail.com"
      var parser = new Parser(message);
      var member = parser.member();
      expect(member).to.be.deep.equal({
        name: "shrivatsa",
        email: "shrivatsa@gmail.com",
        nick: "shrivatsa"
      });
    });

    it("should update sentence", function() {
      var message = "@bot addm new @Shrivatsa @Shrivatsa Shrivatsa@gmail.com"
      var parser = new Parser(message);
      expect(parser.member.bind(parser)).to.throw(/User not found either, or wrong command use type/);
    });

    it("should throw an error for mutiple emails", function() {
      var message = "@bot addm new @Shrivatsa Shrivatsa@gmail.com Shrivatsa@gmail.com"
      var parser = new Parser(message);
      expect(parser.member.bind(parser)).to.throw(/Mutliple email id found/)
    });
  });

  describe("Parser.date()", function() {
    it("should search for month based on days yesterday", function() {
      var message = "@bot addt paid 600 for dinner yesterday. @all"
      var parser = new Parser(message);
      var month = parser.date().month();
      expect(month).to.be.equal(2);
    });

    it("should search for month based on days tomorrow", function() {
      var message = "@bot addt paid 600 for dinner yesterday. @all"
      var parser = new Parser(message);
      var month = parser.date().month();
      expect(month).to.be.equal(2);
    });

    it("should search for month based on days today", function() {
      var message = "@bot addt paid 600 for dinner yesterday. @all"
      var parser = new Parser(message);
      var month = parser.date().month();
      expect(month).to.be.equal(2);
    });

    it("should search for month if not found use current month", function() {
      var message = "@bot addt I owe @Dilip 50"
      var parser = new Parser(message);
      var month = parser.date().month();
      expect(month).to.be.equal(2);
    });

    it("should search for month based on lexicon abberviation months", function() {
      var message = "@bot addt. @kaushik paid 100 for coffee on Feb 3"
      var parser = new Parser(message);
      var month = parser.date().month();
      expect(month).to.be.equal(1);
    });

    it("should search for month based on lexicon months", function() {
      var message = "@bot addt. @kaushik paid 100 for coffee on March 3"
      var parser = new Parser(message);
      var month = parser.date().month();
      expect(month).to.be.equal(2);
    });

    it("should search for date", function() {
      var message = "@bot addt. @kaushik paid 100 for coffee on March 3"
      var parser = new Parser(message);
      var date = parser.date().date();
      expect(date).to.be.equal(3);
    });

    it("should search for date", function() {
      var message = "@bot addt. @kaushik paid 100 for coffee on March 31"
      var parser = new Parser(message);
      var date = parser.date().date();
      expect(date).to.be.equal(31);
    });

    it("should search for date", function() {
      var message = "@bot addt. @kaushik paid 100 for coffee on March 31"
      var parser = new Parser(message);
      var date = parser.date().format("D M YYYY");
      expect(date).to.be.equal("31 3 2015");
    });

    it("should throw exception in case of mutiple months", function() {
      var message = "@bot addt. @kaushik paid 100 for coffee on Feb Mar"
      var parser = new Parser(message);
      expect(parser.date.bind(parser)).to.throw(/Mutiple months found/)
    });
  });

  describe("Parser.transaction()", function() {
    it("search for amount for paid keyword", function() {
      var message = "@bot addt. @kaushik paid 100 for coffee on March 31"
      var parser = new Parser(message);
      var amount = parser.transaction();
      expect(amount).to.be.equal(100);
    });

    it("search for amount for owe keyword", function() {
      var message = "@bot addt I owe @Dilip 50"
      var parser = new Parser(message);
      var amount = parser.transaction();
      expect(amount).to.be.equal(50);
    });

    it("should throw an error for mutiple keyword", function() {
      var message = "@bot addt I owe @Dilip 50 paid"
      var parser = new Parser(message);
      expect(parser.transaction.bind(parser)).to.throw(/No or mutiple keyword found/)
    });
  });

  describe("Parser.transaction()", function() {
    it("search for amount for paid keyword", function() {
      var message = "@bot addt. @kaushik paid 100 for coffee on March 31"
      var parser = new Parser(message);
      var amount = parser.transaction();
      expect(amount).to.be.equal(100);
    });

    it("search for amount for owe keyword", function() {
      var message = "@bot addt I owe @Dilip 50"
      var parser = new Parser(message);
      var amount = parser.transaction();
      expect(amount).to.be.equal(50);
    });

    it("should throw an error for mutiple keyword", function() {
      var message = "@bot addt I owe @Dilip 50 paid"
      var parser = new Parser(message);
      expect(parser.transaction.bind(parser)).to.throw(/No or mutiple keyword found/)
    });
  });

  describe("Parser.bussiness()", function() {
    it("create object based on paid keyword [@bot addt. @kaushik paid 100 for coffee on March 31]", function() {
      var message = "@bot addt. @kaushik paid 100 for coffee on March 31"
      var parser = new Parser(message);
      var object = parser.bussiness("yashprit");
      expect(object).to.be.deep.equal({
        paidBy: "kaushik",
        paidFor: "yashprit"
      });
    });

    it("create object based on owe keyword [@bot addt I owe @Dilip 50]", function() {
      var message = "@bot addt I owe @Dilip 50"
      var parser = new Parser(message);
      var object = parser.bussiness("yashprit");
      expect(object).to.be.deep.equal({
        paidBy: "dilip",
        paidFor: "yashprit"
      });
    });

    it("should throw an error for no keyword", function() {
      var message = "@bot addt I @Dilip 50"
      var parser = new Parser(message);
      expect(parser.bussiness.bind(parser)).to.throw(/Wrong command used/)
    });
  });

  describe("Parser.build()", function() {
    it("build object based on string [@bot addt. @kaushik paid 100 for coffee on March 31]", function() {
      var message = "@bot addt. @kaushik paid 100 for coffee on March 31"
      var parser = new Parser(message);
      var object = parser.build("yashprit");
      expect(object).to.be.deep.equal({
        paidBy: "kaushik",
        paidFor: "yashprit",
        amount: 100,
        date: "31 3 2015"
      });
    });

    it("build object based on string [@bot addt I owe @Dilip 50]", function() {
      var message = "@bot addt I owe @Dilip 50"
      var parser = new Parser(message);
      var object = parser.build("yashprit");
      expect(object).to.be.deep.equal({
        paidBy: "dilip",
        paidFor: "yashprit",
        amount: 50,
        date: "8 3 2015"
      });
    });

    it("build object for string [@bot addt paid 600 for dinner yesterday. @all]", function() {
      var message = "@bot addt paid 600 for dinner yesterday. @all"
      var parser = new Parser(message);
      var object = parser.build("yashprit");
      expect(object).to.be.deep.equal({
        paidBy: "yashprit",
        paidFor: "all",
        amount: 600,
        date: "7 3 2015"
      });
    })

    it("should throw an error for no keyword", function() {
      var message = "@bot addt I @Dilip 50"
      var parser = new Parser(message);
      expect(parser.bussiness.bind(parser)).to.throw(/Wrong command used/)
    });
  });


});
