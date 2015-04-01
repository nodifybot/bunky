var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  report = require("../../lib/report");

module.exports = function(app) {
  app.use('/', router);
};

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Graphs'
  });
});


router.get('/:year/:month', function(req, res, next) {
  console.log(req.params.year)
  report.getCurrentYear(req.params.year, req.params.month)
    .then(function(result) {
      var arr = [];
      for (var key in result) {
        arr.push({
          amount: result[key],
          name: key
        })
      }
      res.status(200).jsonp({
        data: arr
      });
    })
    .catch(function(err) {
      res.status(500).json(err);
    })
});
