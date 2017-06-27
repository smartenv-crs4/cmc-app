var conf = require('../config').conf;
var User = require('../models/apps').User;


//Middleware to parse DB query fields selection from request URI
//Adds dbQueryFields to request
exports.parseFields = function (req, res, next) {

    var fields = req.query.fields ? req.query.fields.split(",") : null;
    if (fields) {
        req.dbQueryFields = fields.join(' ');
    }
    else {
        req.dbQueryFields = null;
    }
    next();

};


//Middleware to parse pagination params from request URI
//Adds dbPagination to request
exports.parsePagination = function (req, res, next) {

    var skip = req.query.skip && !isNaN(parseInt(req.query.skip)) ? parseInt(req.query.skip) : conf.skip;
    var limit = req.query.limit && parseInt(req.query.limit) < conf.limit ? parseInt(req.query.limit) : conf.limit;

    req.dbPagination = {"skip": skip, "limit": limit};
    next();
};

exports.ensureUserIsAdminOrSelf = function (req, res, next) {

    var id = (req.params.id).toString();

    if (!req.User_App_Token)
        return res.status(401).send({
            error: "Forbidden",
            error_message: 'you are not authorized to access the resource (no user in the request)'
        });
    if (!(((conf.adminUser.indexOf(req.User_App_Token.type) >= 0)) || (req.User_App_Token._id == id))) //if token belongs to a non-admin user and it's not that user
        return res.status(401).send({
            error: "Forbidden",
            error_message: 'only ' + conf.adminUser + ' or the user itself are authorized to modify user fields. your Token Id:' + req.User_App_Token._id + " searchId:" + id
        });
    else
        next();

};

exports.parseOptions = function (req, res, next) {

    var sortDescRaw = req.query.sortDesc ? req.query.sortDesc.split(",") : null;
    var sortAscRaw = req.query.sortAsc ? req.query.sortAsc.split(",") : null;

    if (sortAscRaw || sortDescRaw)
        req.sort = {asc: sortAscRaw, desc: sortDescRaw}
    else
        req.sort = null;
    next();

};