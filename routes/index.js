/*
 ############################################################################
 ############################### GPL III ####################################
 ############################################################################
 *                  Copyright 2017 CRS4                                      *
 *   This file is part of CRS4 Microservice Core - Application (CMC-App).   *
 *                                                                          *
 *     CMC-App is free software: you can redistribute it and/or modify      *
 *   it under the terms of the GNU General Public License as published by   *
 *    the Free Software Foundation, either version 3 of the License, or     *
 *                (at your option) any later version.                       *
 *                                                                          *
 *        CMC-App is distributed in the hope that it will be useful,        *
 *      but WITHOUT ANY WARRANTY; without even the implied warranty of      *
 *       MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the      *
 *              GNU General Public License for more details.                *
 *                                                                          *
 *     You should have received a copy of the GNU General Public License    *
 *     along with CMC-App.  If not, see <http://www.gnu.org/licenses/>.     *
 ############################################################################
 */

var express = require('express');
var router = express.Router();
var User = require('../models/apps').User;
var conf = require('../config').conf;

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


/* GET environment info page. */
router.get('/running_env', function(req, res) {
    res.status(200).send({conf:conf});
});

module.exports = router;
