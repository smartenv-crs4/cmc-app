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


var mongoose = require('mongoose');
var conf = require('../config').conf;
var app = require('../app');
var commonFunctions = require('../routes/commonfunctions');

var dbAuth= conf.dbAuth.user ? conf.dbAuth.user + ":" + conf.dbAuth.psw + "@" : "";
var authSource= conf.dbAuth.user ? "?authSource=admin" : "";
var dbUrl =  "mongodb://" + dbAuth + conf.dbHost + ':' + conf.dbPort + '/' + conf.dbName + authSource;

//var dbUrl = conf.dbHost + ':' + conf.dbPort + '/' + conf.dbName;

var options = {
    server: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}},
    useNewUrlParser: true
};

exports.connect = function connect(callback) {

    mongoose.connect(dbUrl, options, function (err, res) {
        if (err) {
            callback(err);
        }
        else {
            console.log("############################### Admin Super User List Creation Start ###############################");
            commonFunctions.setConfig(function (err, userT) {
                if (err) console.log("ERROR in creation admin superuser list " + err.error_message);
                console.log("ADMIN USERS:" + conf.adminUser);
                console.log("ADMIN APPS:" + conf.AdminAuthorizedApp);
                console.log("############################### Admin Super User List Creation END ###############################");
                callback();
            });
        }
    });
};

exports.disconnect = function disconnect(callback) {
    mongoose.disconnect(callback);
};
