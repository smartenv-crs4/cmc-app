/*
 ############################################################################
 ############################### GPL III ####################################
 ############################################################################
 Copyright 2017 CRS4 
 This file is part of CRS4 Microservice Core - Application (CMC-App).
 *                                                                            *
 CMC-Auth is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 *                                                                            *
 CMC-Auth is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 *                                                                            *
 You should have received a copy of the GNU General Public License
 along with CMC-User.  If not, see <http://www.gnu.org/licenses/>.
 * ############################################################################
 */


var mongoose = require('mongoose');
var findAllFn = require('./metadata').findAll;
var Schema = mongoose.Schema;
var conf = require('../config').conf;

var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var appSch = conf.AppSchema || {
        _id: {type: Schema.Types.ObjectId, index: true}, // id in Authentication microservice
        name: String,
        email: {
            type: String,
            trim: true,
            unique: true,
            index: true,
            required: 'Email address is required',
            validate: [validateEmail, 'Please fill a valid email address'],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        avatar: String,
        // password: String,  // passportLocalMongoose manage hash and salt information
        notes: String
    };

var AppSchema = new Schema(appSch, {strict: "throw"});

// Static method to retrieve resource WITH metadata
AppSchema.statics.findAll = function (conditions, fields, options, callback) {
    return findAllFn(this, 'apps', conditions, fields, options, callback);
};

var App = mongoose.model('App', AppSchema);

module.exports.AppSchema = AppSchema;
module.exports.App = App;
