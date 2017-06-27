var express = require('express');
var router = express.Router();
var User = require('../models/apps').User;

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {title: 'CMC App API Microservice dev'});
});

/* GET environment info page. */
router.get('/env', function (req, res) {
    var env;
    if (process.env['NODE_ENV'] === 'dev')
        env = 'dev';
    else
        env = 'production';

    res.status(200).send({env: env});
});

module.exports = router;
