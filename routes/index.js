var express = require('express');
var router = express.Router();
var User = require('../models/apps').User;

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Caport2020 App API Microservice dev' });
});






module.exports = router;
