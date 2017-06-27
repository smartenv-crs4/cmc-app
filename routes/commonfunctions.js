/*
 ############################################################################
 ############################### GPL III ####################################
 ############################################################################
 Copyright 2017 CRS4 
 This file is part of CRS4 Microservice Core - Application (CMC-App).
 *                                                                            *
 CMC-App is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 *                                                                            *
 CMC-App is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 *                                                                            *
 You should have received a copy of the GNU General Public License
 along with CMC-App.  If not, see <http://www.gnu.org/licenses/>.
 * ############################################################################
 */


var conf = require('../config').conf;
var util = require('util');
var request = require('request');
var async = require('async');
var _ = require('underscore');

exports.setConfig = function (callback) {

    async.parallel([
        function (clb) {
            var rqparams = {
                url: conf.authUrl + "/tokenactions/getsupeusertokenlist",
                headers: {'Authorization': "Bearer " + conf.auth_token}
            };
            request.get(rqparams, function (error, response, body) {
                if (error) {
                    callback({error: 'internal_User_microservice_error', error_message: error + ""}, null);

                } else {
                    var appT = JSON.parse(body).superuser;
                    conf.adminUser = appT;
                    clb(null, appT);
                }
            });
        },
        function (clb) {
            var rqparams = {
                url: conf.authUrl + "/tokenactions/getsuperapptokenlist",
                headers: {'Authorization': "Bearer " + conf.auth_token}
            };
            request.get(rqparams, function (error, response, body) {
                if (error) {
                    clb({error: 'internal_User_microservice_error', error_message: error + ""}, null);

                } else {
                    var appT = JSON.parse(body).superapp;
                    conf.AdminAuthorizedApp = appT;
                    clb(null, appT);
                }
            });
        },
    ], function (err, results) {
        if (err)
            callback(err, null);
        else
            callback(null, results[0].concat(results[1]));
    });

};