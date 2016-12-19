// @file jwtauth.js

var jwt = require('jwt-simple');
var conf = require('../config').conf;
var request = require('request');
var _=require('underscore');



exports.decodeToken = function(req, res, next) {


    console.log("decodeToken");

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

        // var URI;
        // var path=(req.route.path=="/") ? "" : req.route.path;
        // if(_.isEmpty(req.baseUrl))
        //     URI=req.path+path;
        // else
        //     URI=req.baseUrl+path;


        var path= (_.isEmpty(req.route)) ?  req.path : req.route.path;
        var URI=(_.isEmpty(req.baseUrl)) ? path : (req.baseUrl+path) ;
        URI=URI.endsWith("/") ? URI : URI+"/";

        var rqparams={
            url: conf.authProtocol + "://" + conf.authHost + ":" + conf.authPort + conf.apiGwAuthBaseUrl + "/" + conf.apiVersion + '/tokenactions/checkiftokenisauth',
            headers : {'Authorization' : "Bearer "+ conf.auth_token, 'content-type': 'application/json'},
            body:JSON.stringify({decode_token:token,URI:URI,method:req.method})
        };


        var decoded=null;

        request.post(rqparams, function(error, response, body){

            if(error) {
                console.log("ERROR:"+error);
                return  res.status(500).send({error:'internal_microservice_error', error_message:error+" "});
            }else{

                decoded = JSON.parse(body);

                if(_.isUndefined(decoded.valid)){
                    return  res.status(response.statusCode).send({error:decoded.error, error_message : decoded.error_message});
                }else{
                    if(decoded.valid==true){
                        req.User_App_Token=decoded.token;
                        next();
                    }else{
                        return  res.status(401).send({error:'Unauthorized', error_message : decoded.error_message});
                    }
                }
            }
        });

    } else {
        return res.status(400)
            .set({'WWW-Authenticate':'Bearer realm='+exampleUrl+', error="invalid_request", error_message="The access token is required"'})
            .send({error:"invalid_request",error_message:"Unauthorized: Access token required, you are not allowed to use the resource"});
    }

};


//
// exports.decodeToken = function(req, res, next) {
//
//
//     console.log("decodeToken");
//
//     var token = (req.body && req.body.access_token) || (req.query && req.query.access_token); // || req.headers['x-access-token'];
//     if (req.headers['authorization']) {
//         var value = req.headers['authorization'];
//         header = value.split(" ");
//         if (header.length == 2)
//             if (header[0] == "Bearer") {
//                 token = header[1];
//              }
//     }
//
//     var exampleUrl = "http://cp2020.crs4.it/";
//
//     if (token) {
//
//         var rqparams={
//             url:mytoken.microserviceAuthMS+'/tokenactions/decodeToken',
//             headers : {'Authorization' : "Bearer "+ mytoken.MyMicroserviceToken, 'content-type': 'application/json'},
//             body:JSON.stringify({decode_token:token})
//         };
//
//         console.log("richiesta:" + JSON.stringify(rqparams));
//
//         var decoded=null;
//         request.post(rqparams, function(error, response, body){
//
//             console.log("Body:"+body);
//             if(error) {
//                 console.log("ERROR:"+error);
//                 return  res.status(500).send({error:'internal_microservice_error', error_message:error+" "});
//             }else{
//                 decoded = JSON.parse(body);
//
//                 if(decoded.valid==true){
//                     req.User_App_Token=decoded.token;
//                     next();
//                 }else{
//                     return  res.status(response.statusCode).send({error:'invalid_token', error_message : decoded.error_message});
//                 }
//             }
//         });
//
//     } else {
//        return res.status(400)
//             .set({'WWW-Authenticate':'Bearer realm='+exampleUrl+', error="invalid_request", error_message="The access token is required"'})
//             .send({error:"invalid_request",error_message:"Unauthorized: Access token required, you are not allowed to use the resource"});
//     }
//
// };

//exports.ensureIsMicroservice = function(req, res, next) {
//
//    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token); // || req.headers['x-access-token'];
//
//
//
//    if (req.headers['authorization']) {
//        var value = req.headers['authorization'];
//        header = value.split(" ");
//        if (header.length == 2)
//            if (header[0] == "Bearer") {
//                token = header[1];
//            }
//    }
//
//    var exampleUrl = "http://cp2020.crs4.it/";
//
//    if (token) {
//
//
//        //   console.log(decoded.iss);
//        if (token!=mytoken.MyMicroserviceToken) {
//            return res.status(401)
//                .set({'WWW-Authenticate': 'Bearer realm=' + exampleUrl + ', error="invalid_token", error_message="The access token is not valid"'})
//                .send({error: "invalid_token", error_message: "Unauthorized: The access token is not valid"});
//        }
//        //debug(decoded);
//        next();
//
//    } else {
//        res.status(401)
//            .set({'WWW-Authenticate': 'Bearer realm=' + exampleUrl + ', error="invalid_request", error_message="The access token is required"'})
//            .send({
//                error: "invalid_request",
//                error_message: "Unauthorized: Access token required, you are not allowed to use the resource"
//            });
//    }
//};