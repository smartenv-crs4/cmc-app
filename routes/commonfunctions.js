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