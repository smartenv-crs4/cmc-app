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

var util = require('util');
var conf = require('../config').conf;
var _ = require('underscore')._;


//Wraps the find() method to include metadata
exports.findAll = function findAll(schema, entityName, conditions, fields, options, callback) {

    var opt = options ? options : {skip: conf.skip, limit: conf.limit};
    schema.find(conditions, fields, opt, function (err, result) {
        if (!err) {
            schema.count(conditions, function (err, count) {
                if (!err) {
                    var entities = entityName ? entityName : 'entities';
                    var results = {
                        _metadata: {
                            totalCount: count,
                            skip: opt.skip,
                            limit: opt.limit
                        }
                    };
                    results[entities] = result;
                    callback(null, results);
                }
                else callback(err, null);
            });
        }
        else callback(err, null);
    });

};

exports.findAllPopulated = function findAllPopulated(schema, entityName, conditions, fields, options, populate, callback) {

    var opt = options ? options : {skip: conf.skip, limit: conf.limit};
    if (!populate || _.isEmpty(populate)) throw new Error("Populate cannot be empty");
    else {
        var query = schema.find(conditions, fields, opt);

        //populate
        _.each(_.keys(populate), function (p, index) {
            query = query.populate(p, populate[p].join(' '));
        });

        query.exec(function (err, result) {
            if (!err) {
                schema.count(conditions, function (err, count) {
                    if (!err) {
                        var entities = entityName ? entityName : 'entities';
                        var results = {
                            _metadata: {
                                totalCount: count,
                                skip: opt.skip,
                                limit: opt.limit
                            }
                        };
                        results[entities] = result;
                        callback(null, results);
                    }
                    else {
                        callback(err, null);
                    }
                });
            }
            else {
                callback(err, null);
            }
        });
    }

};
