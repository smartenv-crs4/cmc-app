var express = require('express');
var middlewares = require('./middlewares');
var Application = require('../models/apps').App;
var util = require('util');
var _ = require('underscore')._;
var router = express.Router();
var jwtMiddle = require('./jwtauth');
var conf=require('../config').conf;
var async=require('async');

var request = require('request');


var gwExists=_.isEmpty(conf.apiGwAuthBaseUrl) ? "" : conf.apiGwAuthBaseUrl;
gwExists=_.isEmpty(conf.apiVersion) ? gwExists : gwExists + "/" + conf.apiVersion;
var microserviceBaseURL = conf.authProtocol + "://" + conf.authHost + ":" + conf.authPort + gwExists;
var microserviceTokem=conf.auth_token;

router.use(middlewares.parsePagination);
router.use(middlewares.parseFields);


// Begin Macro
/**
 * @apiDefine NotFound
 * @apiError 404_NotFound The Object with specified <code>id</code> was not found.<BR>
 * <b>request.body.error</b> contains an error name specifying the 404_NotFound error.<BR>
 * <b>request.body.error_message</b> contains an error message specifying the 404_NotFound error.<BR>
 */

/**
 * @apiDefine Metadata
 * @apiSuccess {Object} _metadata Object containing metadata for pagination info
 * @apiSuccess {Number} _metadata.skip Number of results of this query skipped
 * @apiSuccess {Number} _metadata.limit Limits the number of results to be returned by this query.
 * @apiSuccess {Number} _metadata.totalCount Total number of query results.
 */

/**
 * @apiDefine  ServerError
 * @apiError 500_ServerError Internal Server Error. <BR>
 * <b>request.body.error</b>: error type message specifying the problem, e.g. <i>Db Internal Microservice Error ....</i><BR>
 * <b>request.body.error_message</b>: error message specifying the problem e.g. <i>Connection Down</i><BR>
 * @apiErrorExample Error-Response: 500 Internal Server Error
 *     HTTP/1.1 500 Internal Server Error
 *      {
 *         "error": 'Internal Error'
 *         "error_message": 'something blew up, ERROR: No MongoDb Connection'
 *      }
 */

/**
 * @apiDefine  BadRequest
 * @apiError 400_BadRequest The server cannot or will not process the request due to something perceived as a client error<BR>
 * <b>request.body.error</b> error type message specifying the problem, e.g. <i>BadRequest ....</i><BR>
 * <b>request.body.error_message</b> error message specifying the problem e.g. <i>malformed request syntax, invalid reques, invalid fields ....</i><BR>
 *
 *  @apiErrorExample Error-Response: 400 BadRequest
 *     HTTP/1.1 400 InvalidRequest
 *      {
 *         error:'BadRequest',
 *         error_message:'no body sended',
 *      }
 */

/**
 * @apiDefine  Unauthorized
 * @apiError 401_Unauthorized Not authorized to call this endpoint.<BR>
 * <b>request.body.error:</b> error type message specifying the problem, e.g. <i>NotAuthorized ....</i><BR>
 * <b>request.body.error_message:</b> error message specifying the problem e.g. <i>only admin user can create admin user</i><BR>
 * @apiErrorExample Error-Response: 401 Unauthorized
 *     HTTP/1.1 401 Unauthorized
 *      {
 *         "error":"invalid_token",
 *         "error_description":"Unauthorized: The access token expired"
 *      }
 */

/**
 * @apiDefine  InvalidUserAndPassword
 * @apiError 403_Unauthorized Username or password not valid.<BR>
 * <b>request.body.error:</b> error type message specifying the problem, e.g. <i>Not Logged ....</i><BR>
 * <b>request.body.error_message:</b> error message specifying the problem e.g. <i>wrong username or password</i><BR>
 * @apiErrorExample Error-Response: 403 Unauthorized
 *     HTTP/1.1 403 Unauthorized
 *      {
 *         "error":"Unauthorized",
 *         "error_description":"Warning: wrong username"
 *      }
 */

/**
 * @apiDefine GetResource
 * @apiSuccess {Object[]} apps a paginated array list of users objects
 * @apiSuccess {String} apps.id User id identifier
 * @apiSuccess {String} apps.field1 field 1 defined in schema
 * @apiSuccess {String} apps.field2 field 2 defined in schema
 * @apiSuccess {String} apps.fieldN field N defined in schema
 */

/**
 * @apiDefine GetResourceExample
 * @apiSuccessExample {json} Example: 200 OK, Success Response
 *     {
 *       "apps":[
 *                      {
 *                          "_id": "543fdd60579e1281b8f6da92",
 *                          "email": "prova@prova.it",
 *                          "name": "prova",
 *                          "notes": "Notes About prova"
 *                      },
 *                      {
 *                       "id": "543fdd60579e1281sdaf6da92",
 *                          "email": "prova1@prova.it",
 *                          "name": "prova1",
 *                          "notes": "Notes About prova1"
 *
 *                     },
 *                    ...
 *                 ],
 *
 *       "_metadata":{
 *                   "skip":10,
 *                   "limit":50,
 *                   "totalCount":100
 *                   }
 *     }
 */

// End Macro


//###################################### PROPERTIES FILE DEFAULT.JSON #######################################################
/**
 * @api Configuration Fields
 * @apiVersion 1.0.0
 * @apiName Configuration
 * @apiGroup Configuration
 *
 * @apiDescription This section lists the configuration parameters of the microservice. You can set these parameters in default.json in
 * config directory (under project root), or by command line thanks to the propertiesmanager package.
 *
 * default.json properties can be overridden and extended by command line parameters.
 *
 * To extend it, you must type in command line --ParamName=ParamValues as in the example below:
 *
 * Override "property_1" properties from default.json :
 *
 * $ npm start -- --property_1="Override_TestOne".
 *
 * The first "--" after npm start command must be used to tell npm that the next parameters must be passed to node bin/www, so if you run your
 * application with node bin/www the first "--" shall not be used, as in:
 *
 * $node bin/www --properties_One="Override_TestOne".
 *
 * To override parameters in a tree data structure as a JSON, you have to access the nested fields by using the dotted (".") syntax.
 *
 * For further examples see propertiesmanager npm package.
 *
 *
 * @apiParam {Number} dbPort mongoDb port number
 * @apiParam {String} dbHost mongoDb host name
 * @apiParam {String} dbName mongoDb database name
 * @apiParam {Number} limit  default limit param used to paginate GET responses
 * @apiParam {Number} skip   default skip param used to paginate GET responses
 * @apiParam {String} logfile log file path
 *
 * @apiParam {String} authProtocol protocol used to call authorization microservice resource
 * @apiParam {String} authHost authorization microservice IP or host name
 * @apiParam {String} authPort port used to call a resource from authorization microservice
 * @apiParam {String} apiGwAuthBaseUrl API gateway base URL. Mandatory only if API calls pass through an API gateway
 * @apiParam {String} apiVersion authorization microservice API version
 * @apiParam {String} auth_token token used to call authorization microservice
 * @apiParam {Object} AppSchema Object containig the mongoDb Schema of Applications. If not set, a schema defined in models/apps.js will be used
 *
 * @apiSampleRequest off
 */
//###################################### PROPERTIES FILE DEFAULT.JSON #######################################################




/**
 * @api {post} /apps/signup Register a new Application
 * @apiVersion 1.0.0
 * @apiName Create Application
 * @apiGroup Application
 *
 * @apiDescription Protected by access token, creates a new Application object and returns the access credentials.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (Body parameter) {Object} application          Application dictionary with all the fields. email, password and type are mandatory
 * @apiParam (Body parameter) {String} application.email    Application email valid as username to login
 * @apiParam (Body parameter) {String} application.password Application password
 * @apiParam (Body parameter) {String} application.type     Application type, e.g. external, webUi...
 * @apiParam (Body parameter) {String} [application.name]   Application name, e.g. cruiseKiosk, PortWebUI...
 * @apiParam (Body parameter) {String} [application.avatar] Application avatar image identifier in uploadms
 * @apiParam (Body parameter) {String} [application.notes]  Application notes
 *
 * @apiParamExample {json} Request-Example:
 * HTTP/1.1 POST request
 *  Body:{ "email": "prova@prova.it" , "password":"provami", "type":"ext", "name":"nome"}
 *
 * @apiSuccess (201 - CREATED) {Object} access_credentials                      information about access credentials.
 * @apiSuccess (201 - CREATED) {Object} access_credentials.apiKey               information about apiKey
 * @apiSuccess (201 - CREATED) {String} access_credentials.apiKey.token         user Token
 * @apiSuccess (201 - CREATED) {String} access_credentials.apiKey.expires       token expiration date
 * @apiSuccess (201 - CREATED) {Object} access_credentials.refreshToken         information about refreshToken used to renew token
 * @apiSuccess (201 - CREATED) {String} access_credentials.refreshToken.token   user refreshToken
 * @apiSuccess (201 - CREATED) {String} access_credentials.refreshToken.expires refreshToken expiration date
 *
 * @apiSuccess (201 - CREATED) {Object} Created_resource  the created User resource
 * @apiSuccess (201 - CREATED) {String} Created_resource.UserField_1  field 1 defined in Application Schema (e.g. name)
 * @apiSuccess (201 - CREATED) {String} Created_resource.UserField_2  field 2 defined in Application Schema (e.g. surname)
 * @apiSuccess (201 - CREATED) {String} Created_resource.UserField_N  field N defined in Application Schema (e.g. type)
 *
 * @apiSuccessExample {json} Example: 201 CREATED
 *      HTTP/1.1 201 CREATED
 *      {
 *        "created_resource":{
 *                 "name":"Micio",
 *                 "email":"mario@caport.com",
 *                 "id":"57643332ab9293ff0b5da6f0"
 *        },
 *        "access_credentials":{
 *                 "apiKey":{
 *                         "token":"VppR5sHU_hV3U",
 *                         "expires":1466789299072
 *                  },
 *                  "refreshToken":{
 *                          "token":"eQO7de4AJe-syk",
 *                          "expires":1467394099074
 *                   }
 *        }
 *       }
 *
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse ServerError
 * @apiSampleRequest off
 *
 */
//router.post('/signup',[middlewares.ensureUserIsAuthAppOrAdmin],function(req, res){
router.post('/signup', [jwtMiddle.decodeToken], function (req, res) {

    //console.log("USER SIGNUP " + conf.AdminAuthorizedApp);

    // if(req.application.valid){ //if ot valid retuen in jwtaut midleware
    //  if(conf.SignUpAuthorizedApp.indexOf(req.User_App_Token.type)>=0 ){ // se il token è di un app che può fare login

    if (!req.body || _.isEmpty(req.body))  return res.status(400).send({
        error: "no_body",
        error_message: 'request body missing'
    });

    var application = req.body.application;
    //var password = req.body.application.password;

    if (!application) return res.status(400).send({error: 'BadREquest', error_message: "No application sent"});

    if ((conf.AdminAuthorizedApp.indexOf(application.type) >= 0) && (!(conf.adminUser.indexOf(req.User_App_Token.type) >= 0))) // se il token è di un utente non Admin))to create admin application
        return res.status(401).send({
            error: 'not Authorized',
            error_message: "Only Admin User can register admin application"
        });

    //if (!password) return res.status(400).send({error: 'no password sent', error_message : "No password provided"});
    //delete application['password'];

    //registra l'utente sul microservizio autenticazione

    var loginApp = {
        "email": application.email,
        "password": application.password,
        "type": application.type
    };

    var rqparams = {
        url: microserviceBaseURL + '/authApp/signup',
        headers: {'Authorization': "Bearer " + microserviceTokem, 'content-type': 'application/json'},
        body: JSON.stringify({app: loginApp})
    };

//    console.log("signUp request param"+JSON.stringify(rqparams));

    request.post(rqparams, function (error, response, body) {

        if (error) {
            return res.status(500).send({error: 'internal_microservice_error', error_message: error + ""});
        } else {

            console.log("signUp response body" + body);
            var loginToken = JSON.parse(body);

            if(!loginToken.error){ // ho un token valido
                application._id=loginToken.userId;
                delete application['password'];
                delete application['type'];
                delete loginToken['userId'];
                try {
                    Application.create(application, function (err, newApp) {
                        if (err) {
                            rqparams = {
                                url: microserviceBaseURL + '/authapp/' + application._id,
                                headers: {'Authorization': "Bearer " + microserviceTokem}
                            };

                            request.delete(rqparams, function (error, response, body) {
                                if (error)
                                    console.log("inconsistent data");
                                //TODO se in seguito ad una creazione utente non andat a buon fine l'eliminazione dell utente sul microservizio auth non va a buon fine si hanno dati inconsistenti

                            });
                            return res.status(500).send({error: 'internal_Error', error_message: err});

                        } else {
                            var tmpU = JSON.parse(JSON.stringify(newApp));
                            console.log("new application:" + util.inspect(tmpU));
                            delete tmpU['__v'];
                            //delete tmpU['_id'];
                            return res.status(201).send({"created_resource": tmpU, "access_credentials": loginToken});
                        }
                    });
                } catch (ex) {
                    //console.log("ECCCEPTIO "+ ex);
                    rqparams = {
                        url: microserviceBaseURL + '/authapp/' + application._id,
                        headers: {'Authorization': "Bearer " + microserviceTokem}
                    };

                    request.delete(rqparams, function (error, response, body) {
                        if (error)
                            console.log("inconsistent data");
                        //TODO se in seguito ad una creazione utente non andat a buon fine l'eliminazione dell utente sul microservizio auth non va a buon fine si hanno dati inconsistenti

                    });
                    return res.status(500).send({
                        error: "signup_error",
                        error_message: 'Unable to register application (err:' + ex + ')'
                    });
                }
            } else {
                return res.status(response.statusCode).send(loginToken);
            }
        }
    });

    //} else{
    //   res.status(401).send({error: "invalid_token", error_description: "Unauthorized: The access token is not valid to access the resource. Use access_token of this type:" + conf.SignUpAuthorizedApp});
    //}
    //}else{
    //    res.status(401).send({error: "invalid_token", error_description:req.application.error_description });
    //}

});



/**
 * @api {post} /apps/signin Application login
 * @apiVersion 1.0.0
 * @apiName Login Application
 * @apiGroup Application
 *
 * @apiDescription Protected by access token, logins Application and returns the access credentials.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (Body parameter) {String} username The email
 * @apiParam (Body parameter) {String} password The password
 *
 * @apiParamExample {json} Request-Example:
 * HTTP/1.1 POST request
 *  Body:{ "username": "prov@prova.it" , "password":"provami"}
 *
 * @apiSuccess (200 - OK) {Object} access_credentials                       information about access credentials.
 * @apiSuccess (200 - OK) {Object} access_credentials.apiKey                information about apiKey
 * @apiSuccess (200 - OK) {String} access_credentials.apiKey.token          user Token
 * @apiSuccess (200 - OK) {String} access_credentials.apiKey.expires        token expiration date
 * @apiSuccess (200 - OK) {Object} access_credentials.refreshToken          information about refreshToken used to renew token
 * @apiSuccess (200 - OK) {String} access_credentials.refreshToken.token    user refreshToken
 * @apiSuccess (200 - OK) {String} access_credentials.refreshToken.expires  refreshToken expiration date
 * @apiSuccess (200 - OK) {String} access_credentials.userId                application id
 *
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 OK
 *      {
 *        "access_credentials":{
 *                 "apiKey":{
 *                         "token":"VppR5sHU_hV3U",
 *                         "expires":1466789299072
 *                  },
 *                  "refreshToken":{
 *                          "token":"eQO7de4AJe-syk",
 *                          "expires":1467394099074
 *                   },
 *                   "userId":"34324JHGJ89787"
 *
 *        }
 *       }
 *
 * @apiUse Unauthorized
 * @apiUse BadRequest
 * @apiUse ServerError
 * @apiUse InvalidUserAndPassword
 * @apiSampleRequest off
 */
router.post('/signin', [jwtMiddle.decodeToken], function (req, res) {

    // if(req.user.valid){ //if ot valid retuen in jwtaut midleware
    //  if(conf.AdminAuthorizedApp.indexOf(req.User_App_Token.type)>=0 ){ // se il token è di un app che può fare login

    if (!req.body || _.isEmpty(req.body))  return res.status(400).send({
        error: "BadRequest",
        error_message: 'request body missing'
    });

    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password) return res.status(400).send({
        error: 'BadRequest',
        error_message: "No username o password provided"
    });

    var rqparams = {
        url: microserviceBaseURL + '/authApp/signin',
        headers: {'Authorization': "Bearer " + microserviceTokem, 'content-type': 'application/json'},
        body: JSON.stringify({username: username, password: password})
    };

    request.post(rqparams, function (error, response, body) {

        if (error) {
            return res.status(500).send({error: 'internal_microservice_error', error_message: error + ""});
        } else {

            console.log("signUp response body" + body);
            var loginToken = JSON.parse(body);

            if (!loginToken.error) { // ho un token valido
                return res.status(200).send({"access_credentials": loginToken});
            }
            else  return res.status(response.statusCode).send(loginToken);

        }
    });

});



/**
 * @api {get} /apps/ Get all Applications
 * @apiVersion 1.0.0
 * @apiName Get Applications
 * @apiGroup Application
 *
 * @apiDescription Protected by admin access token, returns the paginated list of all Applications.
 * Set pagination skip and limit and other filters in the URL request, e.g. "get /users?skip=10&limit=50&name=Mario"
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (Query Parameter) {String} ApplicationField_1 query    field 1 used to set filter, e.g. name = "App Name"
 * @apiParam (Query Parameter) {String} ApplicationField_2 query    field 2 used to set filter, e.g. Filed2 = "Field Value"
 * @apiParam (Query Parameter) {String} ApplicationField_etc query  field ... used to set filter, e.g. Filed.. = "Field Value"
 * @apiParam (Query Parameter) {String} ApplicationField_N query    field N used to set filter, e.g. Field3 = "Field Value"
 *
 * @apiUse Metadata
 * @apiUse GetResource
 * @apiUse GetResourceExample
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 */
router.get('/', [jwtMiddle.decodeToken], function (req, res) {

    //TODO: returns ALL users, must be changed to return only authorized users
    //given an authenticated user (by token)
    //console.log(req);

    var fields = req.dbQueryFields;

    if (!fields)
        fields = '-hash -salt -__v -_id';

    var query = {};

    for (var v in req.query)
        if (Application.schema.path(v))
            query[v] = req.query[v];

    Application.findAll(query, fields, req.dbPagination, function (err, results) {

        if (!err) {

            if (results)
                res.status(200).send(results);
            else
                res.status(204).send();
        }
        else {
            res.status(500).send({error: 'internal_error', error_message: 'something blew up, ERROR:' + err});
        }
    });

});

///* POST user creation. */
//router.post('/',[middlewares.ensureUserIsAdmin], function(req, res) {   //FIXME: replace with signup???
//    //Authorized just admins
//    console.log("USER SIGNUP " + conf.AdminAuthorizedApp);
//
//    // if(req.user.valid){ //if ot valid retuen in jwtaut midleware
//    //  if(conf.AdminAuthorizedApp.indexOf(req.User_App_Token.type)>=0 ){ // se il token è di un app che può fare login
//
//    if(!req.body || _.isEmpty(req.body) )  return res.status(400).send({error:"BadRequest",error_message:'request body missing'});
//
//    //console.log("signUp request user body"+JSON.stringify(req.body.user));
//    var user = req.body.user;
//    //var password = req.body.user.password;
//
//    if (!user) return res.status(401).send({error: 'no user sent', error_message : "No username provided"});
//    //if (!password) return res.status(400).send({error: 'no password sent', error_message : "No password provided"});
//    //delete user['password'];
//
//    //registra l'utente sul microservizio autenticazione
//
//    //console.log("signUp request user body"+JSON.stringify(user));
//
//
//    var rqparams={
//        url:microserviceBaseURL+'/authApp/signup',
//        headers : {'Authorization' : "Bearer "+ microserviceTokem, 'content-type': 'application/json'},
//        body:JSON.stringify({user:user})
//    };
//
//    //console.log("signUp request param"+JSON.stringify(rqparams));
//
//    request.post(rqparams, function(error, response, body){
//
//        if(error) {
//            return  res.status(500).send({error:'internal_microservice_error', error_message : error +""});
//        }else{
//
//            console.log("signUp response body"+body);
//            var loginToken = JSON.parse(body);
//
//            if(!loginToken.error){ // ho un token valido
//                user.id=loginToken.userId;
//                delete user['password'];
//                delete user['type'];
//                delete loginToken['userId'];
//                Application.create(user,function(err,newUser){
//                    if(err){
//                        rqparams={
//                            url:microserviceBaseURL+'/authApp/' + loginToken.userId,
//                            headers : {'Authorization' : "Bearer "+ microserviceTokem}
//                        };
//
//                        request.delete(rqparams, function(error, response, body) {
//                            if (error)
//                                console.log("inconsistent data");
//                            //TODO se in seguito ad una creazione utente non andat a buon fine l'eliminazione dell utente sul microservizio auth non va a buon fine si hanno dati inconsistenti
//
//                        });
//                        return res.status(500).send({error: 'internal_Error', error_message : err});
//
//                    }else{
//                        var tmpU=JSON.parse(JSON.stringify(newUser));
//                        console.log("new user:"+ util.inspect(tmpU));
//                        delete tmpU['__v'];
//                        delete tmpU['_id'];
//                        return res.status(201).send({"created_resource":tmpU, "access_credentials":loginToken});
//                    }
//                });
//            } else{
//                return res.status(401).send(loginToken);
//            }
//        }
//    });
//
//    //} else{
//    //   res.status(401).send({error: "invalid_token", error_description: "Unauthorized: The access token is not valid to access the resource. Use access_token of this type:" + conf.AdminAuthorizedApp});
//    //}
//    //}else{
//    //    res.status(401).send({error: "invalid_token", error_description:req.user.error_description });
//    //}
//
//
//});


/**
 * @api {get} /apps/:id Get Application by id
 * @apiVersion 1.0.0
 * @apiName GetApplication
 * @apiGroup Application
 *
 * @apiDescription Accessible by admin access tokens or by the application itself, returns the info about application.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same  token sent in Authorization header should be undefined
 * @apiParam (URL Parameter) {String} id The user id or username (email)
 *
 * @apiSuccess {String} id      Application id
 * @apiSuccess {String} field1  field 1 defined in schema
 * @apiSuccess {String} field2  field 2 defined in schema
 * @apiSuccess {String} fieldN  field N defined in schema
 *
 * @apiSuccessExample {json} Example: 200 OK, Success Response
 *     {
 *        "id": "543fdd60579e1281b8f6da92",
 *        "email": "prova@prova.it",
 *        "name": "prova",
 *        "notes": "Notes About prova"
 *     }
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 */
router.get('/:id', [jwtMiddle.decodeToken, middlewares.ensureUserIsAdminOrSelf], function (req, res) {

    //TODO: must be changed to return only authorized users
    //given an authenticated user (by token)

    var fields = req.dbQueryFields;
    if (!fields)
        fields = '-hash -salt -__v -_id';

    var id = (req.params.id).toString();

    Application.findById(id, fields, function(err, results){
        if(!err){
                res.send(results);
        }
        else {
            if (results === {} || results === undefined)   res.status(404).send({
                error: 'notFound',
                error_message: 'application not found'
            });
            else res.status(500).send({error: 'internal_error', error_message: 'something blew up, ERROR:' + err});
        }
    });

});



/**
 * @api {put} /apps/:id Update Application
 * @apiVersion 1.0.0
 * @apiName Update Application
 * @apiGroup Application
 *
 * @apiDescription Protected by admin access token (or you must be the Application itself). Updates the Application object and returns the updated resource.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (Body Parameter) {Object} application                      Application dictionary with all the fields to update. Email (username) field can be updated only by admin token; To change password and enable application, there is a dedicated endpoint
 * @apiParam (Body Parameter) {String} application.email email          Application email valid as username to login
 * @apiParam (Body Parameter) {String} application.password password    Application password
 * @apiParam (Body Parameter) {String} application.type type            Application type, e.g. external, webUi...
 * @apiParam (Body Parameter) {String} application.name [name]          Application name, e.g. cruiseKiosk, PortWebUI...
 * @apiParam (Body Parameter) {String} application.avatar [avatar]      Application avatar image id in uploadms
 * @apiParam (Body Parameter) {String} application.notes [notes]        Application notes
 *
 * @apiParamExample {json} Request-Example:
 * HTTP/1.1 PUT request
 *  Body:{ "name":"nome", "surname":"cognome"}
 *
 * @apiSuccess (200 - OK) {String} ApplicationField_1 field 1 updated and defined in Application Schema (e.g. name)
 * @apiSuccess (200 - OK) {String} ApplicationField_2 field 2 updated and defined in Application Schema (e.g. notes)
 * @apiSuccess (200 - OK) {String} ApplicationField_N field N updated and defined in Application Schema (e.g. type)
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 OK
 *      {
 *        "name":"Micio",
 *        "notes":"Macio",
 *      }
 *
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 * @apiSampleRequest off
 */
router.put('/:id', [jwtMiddle.decodeToken, middlewares.ensureUserIsAdminOrSelf], function (req, res) {

    console.log("PUT");

    if (!req.body || _.isEmpty(req.body)) {
        return res.status(400).send({error: "BadRequest", error_message: 'request body missing'});
    }

    var id = (req.params.id).toString();
    var newVals;

    try {
        newVals = req.body.application; // body already parsed
    } catch (e) {
        res.status(500).send({error: "update error", error_message: 'no application updated (error:' + e + ')'});
    }

    if (newVals.password) {
        return res.status(400).send({
            error: "BadRequest",
            error_message: 'password is not a valid param. You must call reset pasword enpoint'
        });
    }

    if (newVals.enabled) {
        return res.status(400).send({
            error: "BadRequest",
            error_message: 'enabled or validated is not a valid param. You must call validate enpoint'
        });
    }

    if (!(conf.adminUser.indexOf(req.User_App_Token.type) >= 0) && newVals.email) {
        return res.status(401).send({error: "Forbidden", error_message: 'only admins users can update email'});
    }

    if (!(conf.adminUser.indexOf(req.User_App_Token.type) >= 0) && newVals.type) {
        return res.status(401).send({
            error: "Forbidden",
            error_message: 'only admins users can update application type'
        });
    }

    Application.findOneAndUpdate({_id:id}, newVals, {new: true}, function (err, results) {

        if (!err) {
            if (results) {
                var tmpU = JSON.parse(JSON.stringify(results));
                console.log("new app:" + util.inspect(tmpU));
                delete tmpU['__v'];
                //delete tmpU['_id'];
                    res.status(200).send(tmpU);
            }
            else {
                res.status(404).send({error: "Notfound", error_message: 'no application found with specified id'});
            }

        }
        else {
            res.status(500).send({error: "internal error", error_message: 'something blew up, ERROR:' + err});
        }
    });

});


function enableDisable(req, res, value) {

    var id = (req.params.id).toString();
    var rqparams = {
        url: value ? microserviceBaseURL + "/authApp/" + id + '/actions/enable' : microserviceBaseURL + "/authApp/" + id + '/actions/disable',
        headers: {'Authorization': "Bearer " + microserviceTokem}
    };

    console.log(util.inspect(rqparams));

    request.post(rqparams, function (error, response, body) {

        if (error) {
            return res.status(500).send({error: 'internal_App_microservice_error', error_message: error + ""});
        } else {
            return res.status(201).send(body);
        }
    });

}



/**
 * @api {post} /apps/:id/actions/resetpassword Reset Application password
 * @apiVersion 1.0.0
 * @apiName ResetPassword
 * @apiGroup Application
 *
 * @apiDescription Protected by access token, creates a reset password Token.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (URL Parameter) {String} id The Application id or username(email)
 *
 * @apiSuccess (200 - OK) {String} reset_token  token to set the new password
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 OK
 *      {
 *        "reset_token":"ffewfh5hfdfds7678d6fsdf7d6fsdfd86d8sf6", *
 *      }
 *
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 * @apiSampleRequest off
 */
router.post('/:id/actions/resetpassword', [jwtMiddle.decodeToken], function (req, res) {

    var id = (req.params.id).toString();

    async.series([
            function (callback) {
                if (id.indexOf("@") >= 0) { // è un ndirizzo email
                    if (id.search(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/igm) >= 0) { // è una mail valida
                        Application.findOne({email: id}, function (err, usr) {
                            if (err) callback({err_code: 500, error: 'internal_error', error_message: err + ""}, 'one');


                            if (!usr)
                                callback({err_code:404, error: 'NotFound', error_message: "no application found whith " + id + " email"},'one');
                            id = usr._id;
                            callback(null, 'one');
                        });

                    } else { // non è una mail valida
                        callback({
                            err_code: 400,
                            error: 'BadRequest',
                            error_message: "Please fill a valid email address"
                        }, 'one');
                    }
                } else {
                    callback(null, 'one');
                }
            }
        ],
        function (err, results) {

            if (err) {
                return res.status(err.err_code).send({error: err.error, error_message: err.error_message + ""});
            } else {
                var rqparams = {
                    url: microserviceBaseURL + "/authApp/" + id + '/actions/resetpassword',
                    headers: {'Authorization': "Bearer " + microserviceTokem}
                };

                console.log("req" + util.inspect(rqparams));

                request.post(rqparams, function (error, response, body) {

                    if (error) {
                        return res.status(500).send({
                            error: 'internal_App_microservice_error',
                            error_message: error + ""
                        });
                    } else {
                        return res.status(200).send(body);
                    }
                });
            }
        });

});



/**
 * @api {post} /apps/:id/actions/setpassword Set new Application password
 * @apiVersion 1.0.0
 * @apiName SetPassword
 * @apiGroup Application
 *
 * @apiDescription Protected by admin access token (or you must be the Application itself). Updates the Application password.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 * @apiParam {String} [access_token] access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (URL parameter) {String} id            Application id or username (email)
 * @apiParam (Body parameter) {String} oldpassword  Old password to update. If set, reset_token must be undefined
 * @apiParam (Body parameter) {String} newpassword  New password
 * @apiParam (Body parameter) {String} reset_token  Token is used to update password. If set, oldpassword must be undefined
 *
 * @apiSuccess (200 - OK) {Object} access_credentials                       information about access credentials.
 * @apiSuccess (200 - OK) {Object} access_credentials.apiKey                information about apiKey
 * @apiSuccess (200 - OK) {String} access_credentials.apiKey.token          user Token
 * @apiSuccess (200 - OK) {String} access_credentials.apiKey.expires        token expiration date
 * @apiSuccess (200 - OK) {Object} access_credentials.refreshToken          information about refreshToken used to renew token
 * @apiSuccess (200 - OK) {String} access_credentials.refreshToken.token    user refreshToken
 * @apiSuccess (200 - OK) {String} access_credentials.refreshToken.expires  refreshToken expiration date
 * @apiSuccess (200 - OK) {String} access_credentials.userId                application id
 *
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 OK
 *      {
 *        "access_credentials":{
 *                 "apiKey":{
 *                         "token":"VppR5sHU_hV3U",
 *                         "expires":1466789299072
 *                  },
 *                  "refreshToken":{
 *                          "token":"eQO7de4AJe-syk",
 *                          "expires":1467394099074
 *                   },
 *                    "userId":"343242354FDGH%"
 *        }
 *      }
 *
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 * @apiSampleRequest off
 */
router.post('/:id/actions/setpassword', [jwtMiddle.decodeToken], function (req, res) {

    if (!req.body) return res.status(400).send({error: "BadREquest", error_message: 'request body missing'});

    var oldpassword = req.body.oldpassword || null;
    var newpassword = req.body.newpassword || null;
    var reset_token = req.body.reset_token || null;

    if (!oldpassword && !reset_token) {
        return res.status(400).send({error: 'BadRequest', error_message: "No oldpassword o reset_token provided"});
    }

    if (oldpassword && reset_token) {
        return res.status(400).send({error: 'BadRequest', error_message: "Use oldpassword or reset_token"});
    }

    if (!newpassword) return res.status(400).send({error: 'BadREquest', error_message: "No newpassword provided"});

    var id = (req.params.id).toString();
    var tmpbody;

    async.series([
            function (callback) {
                if (id.indexOf("@") >= 0) { // è un ndirizzo email
                    if (id.search(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/igm) >= 0) { // è una mail valida
                        Application.findOne({email: id}, function (err, usr) {
                            if (err) callback({err_code: 500, error: 'internal_error', error_message: err + ""}, 'one');

                            if (!usr)callback({
                                err_code: 404,
                                error: 'NotFound',
                                error_message: "no App found whith " + id + " email"
                            }, 'one');

                            id = usr._id;
                            callback(null, 'one');
                        });

                    } else { // non è na mail valida
                        callback({
                            err_code: 400,
                            error: 'BadRequest',
                            error_message: "Please fill a valid email address"
                        }, 'one');
                    }
                } else {
                    callback(null, 'one'); // ho passto l'id utente e non lo username
                }
            },
            function (callback) {

                if (oldpassword) {
                    if (id == req.User_App_Token._id) {
                        tmpbody = {
                            oldpassword: oldpassword,
                            newpassword: newpassword
                        };
                        callback(null, 'two');
                    } else {
                        callback({
                            err_code: 401,
                            error: "Forbidden",
                            error_message: 'you are not authorized to access this resource'
                        });

                    }
                } else {

                    var rqparams = {
                        url: microserviceBaseURL + "/tokenactions/gettokentypelist",
                        headers: {'Authorization': "Bearer " + microserviceTokem}
                    };

                    request.get(rqparams, function (error, response, body) {

                        if (error) {
                            callback({error: 'internal_App_microservice_error', error_message: error + ""}, "two");

                        } else {
                            var appT = JSON.parse(body).user;
                            if (_.without(appT, conf.adminUser).indexOf(req.User_App_Token.type) >= 0) {
                                callback({
                                    err_code: 401,
                                    error: "Forbidden",
                                    error_message: 'you are not authorized to access this resource'
                                }, "two");
                            } else {
                                tmpbody = {
                                    reset_token: reset_token,
                                    newpassword: newpassword
                                };
                                callback(null, 'two');
                            }
                        }
                    });
                }
            }
        ],
        function (err, results) {

            if (err) {
                return res.status(err.err_code).send({error: err.error, error_message: err.error_message + ""});
            } else {
                var rqparams = {
                    url: microserviceBaseURL + "/authapp/" + id + '/actions/setpassword',
                    headers: {'Authorization': "Bearer " + microserviceTokem, 'content-type': 'application/json'},
                    body: JSON.stringify(tmpbody)
                };


                console.log("req" + util.inspect(rqparams));

                request.post(rqparams, function (error, response, body) {

                    if (error) {
                        return res.status(500).send({
                            error: 'internal_App_microservice_error',
                            error_message: error + ""
                        });
                    } else {
                        return res.status(200).send({"access_credentials": JSON.parse(body)});
                    }
                });
            }
        });

});



/**
 * @api {post} /apps/:id/actions/changeuserid Change User Id (email)
 * @apiVersion 1.0.0
 * @apiName ChangeUserId
 * @apiGroup Application
 *
 * @apiDescription Protected by admin access token, updates an application username (email).
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (URL parameter) {String} id        Application id or email
 * @apiParam (Body parameter) {String} email    New application username (email)
 *
 * @apiParamExample {json} Request-Example:
 * HTTP/1.1 GET request
 *  Body:{ "email": "prov@prova.it"}
 *
 * @apiSuccess (200- OK) {Object} application dictionary with new updated username (email)
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 OK
 *      {
 *        "name":"Micio",
 *        "surname":"Macio",
 *        "email": "prov@prova.it"
 *      }
 *
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 * @apiSampleRequest off
 */
router.post('/:id/actions/changeuserid', [jwtMiddle.decodeToken], function (req, res, next) {

    var id = (req.params.id).toString();
    req.url = "/" + id;

    if(!req.body || !req.body.email)
        return res.status(400).send({error:"BadRequest", error_message:"no email field in body. email are mandatory"});

    var body = {app: {email:req.body.email}};

    req.body = body;
    req.method = "PUT";
    try {
        router.handle(req, res, next);
    } catch (ex) {
        res.status(500).send({error: "InternalError", error_message: ex.toString()});
    }

});



/**
 * @api {post} /apps/:id/actions/enable Enable Application
 * @apiVersion 1.0.0
 * @apiName EnableApplication
 * @apiGroup Application
 *
 * @apiDescription Protected by admin access token, enables an Application.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (URL parameter) {String} id The Application id
 *
 * @apiSuccess (200 - OK) {Object} status  The new Application status
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 OK
 *     {
 *        "status":"enabled"
 *     }
 *
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 * @apiSampleRequest off
 */
router.post('/:id/actions/enable', [jwtMiddle.decodeToken], function (req, res) {
    enableDisable(req, res, true);
});


/**
 * @api {post} /apps/:id/actions/disable Disable Application
 * @apiVersion 1.0.0
 * @apiName DisableApplication
 * @apiGroup Application
 *
 * @apiDescription Protected by admin access token, disables an Application.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (URL parameter) {String} id The Application id
 *

 * @apiSuccess (200 - OK) {Object} status contains the new Application status
 *
 * @apiSuccessExample {json} Example: 200 OK
 *      HTTP/1.1 200 OK
 *      {
 *        "status":"disabled"
 *      }
 *
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 * @apiSampleRequest off
 */
router.post('/:id/actions/disable', [jwtMiddle.decodeToken], function (req, res) {
    enableDisable(req, res, false);
});


/**
 * @api {delete} /apps/:id Delete Application
 * @apiVersion 1.0.0
 * @apiName Delete Application
 * @apiGroup Application
 *
 * @apiDescription Protected by admin access token, deletes an Application and returns the deleted resource.
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (URL parameter) {String} id The Application id
 *
 * @apiSuccess (204 - NO CONTENT) {String} ApplicationField_1  field 1 defined in Application Schema (e.g. name)
 * @apiSuccess (204 - NO CONTENT) {String} ApplicationField_2  field 2 defined in Application Schema (e.g. notes)
 * @apiSuccess (204 - NO CONTENT) {String} ApplicationField_N  field N defined in Application Schema (e.g. type)
 *
 * @apiSuccessExample {json} Example: 204 NO CONTENT
 *      HTTP/1.1 204 NO CONTENT
 *      {
 *        "name":"Micio",
 *        "notes":"Macio",
 *      }
 *
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 * @apiSampleRequest off
 */
router.delete('/:id', [jwtMiddle.decodeToken], function (req, res) {

    var id = (req.params.id).toString();

    var rqparams = {
        url: microserviceBaseURL + "/authApp/" + id,
        headers: {'Authorization': "Bearer " + microserviceTokem}
    };


    console.log(util.inspect(rqparams));

    request.delete(rqparams, function (error, response, body) {

        if(error) {
            return  res.status(500).send({error:'internal_App_microservice_error', error_message : error +""});
        }else{
            Application.findOneAndRemove({_id:id},  function(err, results){
                console.log("deleted "+util.inspect(results));
                if(!err){
                    if (results){
                        return res.status(204).send({deleted_resource:results});
                    }
                    else
                        return res.status(404).send({
                            error: "NotFound",
                            error_message: 'no Application found with specified id'
                        });
                }
                else {
                    return res.status(500).send({
                        error: "internal_error",
                        error_message: 'something blew up, ERROR:' + err
                    });
                }

            });
        }
    });

});

/**
 * @api {get} /apps/actions/email/find/:term Search all Applications
 * @apiVersion 1.0.0
 * @apiName Search Application
 * @apiGroup Application
 *
 * @apiDescription Protected by admin access token, returns the paginated list of all Applications matching the search term.
 * To set pagination skip and limit, you can do it in the URL request, e.g. "get /apps?skip=10&limit=50"
 *
 * @apiHeader {String} [Authorization] Unique access_token. If set, the same access_token in body or in query param must be undefined
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoidXNlciIsImlzcyI6IjU4YTMwNTcxM"
 *     }
 * @apiParam {String} [access_token] Access token that grants access to this resource. It must be sent in [ body || as query param ].
 * If set, the same token sent in Authorization header should be undefined
 * @apiParam (URL parameter) {String} term      Query string
 * @apiParam (Query parameter) {String} skip    Pagination start
 * @apiParam (Query parameter) {String} limit   Number of elements
 *
 *
 * @apiUse Metadata
 * @apiUse GetResource
 * @apiUse GetResourceExample
 * @apiUse Unauthorized
 * @apiUse NotFound
 * @apiUse BadRequest
 * @apiUse ServerError
 * @apiSampleRequest off
 */
router.get('actions/email/find/:term', jwtMiddle.decodeToken, function (req, res) {

    var term = req.param.term,
        size = req.query.size ? parseInt(req.query.size) : 10,
        query = {},
        sortParams = {};

    if (!term) return res.json({'status': true, err: 1, 'message': 'term not found', data: []});

    query.email = new RegExp(term, 'i');

    Application.find(query, null, {
        limit: size,
        sort: sortParams
    }, function (err, data) {
        if (err) return res.json({'status': false, 'err': err});

        return res.json({status: true, data: data});
    });

});


module.exports = router;