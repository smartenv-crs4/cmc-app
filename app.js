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
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var LocalStrategy = require('passport-local').Strategy;
var logger = require('morgan');

var conf = require('propertiesmanager').conf;

var routes = require('./routes/index');
var users = require('./routes/apps');
var User = require('./models/apps').User;


var jwt = require('./routes/jwtauth');
var app = express();
var plugin = require('apiextender');
plugin.extend(app);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.set('jwtTokenSecret', 'YOUR_SECRET_STRING');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

// for timestamps in logger

app.use(bodyParser.json());
app.use(logger('dev'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
// static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/doc', express.static('doc', {root: 'doc'}));

//app.use(logger('[:mydate] :method :url :status :res[content-length] - :remote-addr - :response-time ms'));


app.use('/', routes);
app.use('/apps', users); //users and cars
//app.use('/auth', auth); // authorization routes

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'dev') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
