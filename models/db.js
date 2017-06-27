var mongoose = require('mongoose');
var conf = require('../config').conf;
var app = require('../app');
var commonFunctions = require('../routes/commonfunctions');
var dbUrl = conf.dbHost + ':' + conf.dbPort + '/' + conf.dbName;

var options = {
    server: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}}
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
