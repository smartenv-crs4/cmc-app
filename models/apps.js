var mongoose = require('mongoose');
var findAllFn = require('./metadata').findAll;
var Schema = mongoose.Schema;


var conf=require('../config').conf;


var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var appSch= conf.AppSchema || {
        id: {type: Schema.Types.ObjectId, index:true}, // id in Authentication microservice
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
        avatar:String,
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
