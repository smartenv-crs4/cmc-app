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


var jwt = require('jwt-simple');
var conf = require('../config').conf;
var request = require('request');
var _ = require('underscore');

exports.decodeToken = function (req, res, next) {

    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token); // || req.headers['x-access-token'];
    if (req.headers['authorization']) {
        var value = req.headers['authorization'];
        header = value.split(" ");
        if (header.length == 2)
            if (header[0] == "Bearer") {
                token = header[1];
            }
    }

    var exampleUrl = "http://cp2020.crs4.it/";

    if (token) {
        var path = (_.isEmpty(req.route)) ? req.path : req.route.path;
        var URI = (_.isEmpty(req.baseUrl)) ? path : (req.baseUrl + path);
        URI = URI.endsWith("/") ? URI : URI + "/";

        var gw = _.isEmpty(conf.apiGwAuthBaseUrl) ? "" : conf.apiGwAuthBaseUrl;
        gw = _.isEmpty(conf.apiVersion) ? gw : gw + "/" + conf.apiVersion;
        var rqparams = {
            url: conf.authUrl + '/tokenactions/checkiftokenisauth',
            headers: {'Authorization': "Bearer " + conf.auth_token, 'content-type': 'application/json'},
            body: JSON.stringify({decode_token: token, URI: URI, method: req.method})
        };


        var decoded = null;

        request.post(rqparams, function (error, response, body) {

            if (error) {
                console.log("ERROR:" + error);
                return res.status(500).send({error: 'internal_microservice_error', error_message: error + " "});
            } else {

                decoded = JSON.parse(body);

                if (_.isUndefined(decoded.valid)) {
                    return res.status(response.statusCode).send({
                        error: decoded.error,
                        error_message: decoded.error_message
                    });
                } else {
                    if (decoded.valid == true) {
                        req.User_App_Token = decoded.token;
                        next();
                    } else {
                        return res.status(401).send({error: 'Unauthorized', error_message: decoded.error_message});
                    }
                }
            }
        });

    } else {
        return res.status(400)
            .set({'WWW-Authenticate': 'Bearer realm=' + exampleUrl + ', error="invalid_request", error_message="The access token is required"'})
            .send({
                error: "invalid_request",
                error_message: "Unauthorized: Access token required, you are not allowed to use the resource"
            });
    }

};