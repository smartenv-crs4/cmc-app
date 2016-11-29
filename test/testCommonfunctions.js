
var conf=require('../config').conf;
var util=require('util');
var request=require('request');
var async=require("async");
var db = require("../models/db");
var server;
var app = require('../app');
var Port = 3020;
var authHost = conf.authProtocol + "://" + conf.authHost + ":" + conf.authPort;

exports.setAuthMsMicroservice=function(doneCallback){

    var url = authHost;


    async.series([
        function(callback){ // ccheck if AuthMs is in dev mode
            request.get(url+"/env", function(error, response, body){

                if(error) {
                    throw error;
                }else{
                    var env=JSON.parse(body).env;
                    console.log("BDY "+body);
                    if(env=="dev"){
                        request.get(conf.userProtocol + "://" + conf.userHost + ":" + conf.userPort + "/env", function(error, response, body){

                            if(error) {
                                throw error;
                            }else{
                                var env=JSON.parse(body).env;
                                console.log("BDY "+body);
                                if(env=="dev"){
                                    db.connect(function (err) {
                                        if (err) console.log("######   ERRORE BEFORE : " + err +"  ######");

                                        app.set('port', process.env.PORT || Port);

                                        server = app.listen(app.get('port'), function () {
                                            console.log('TEST Express server listening on port ' + server.address().port);
                                            callback(null,"one");
                                        });
                                    });
                                }else{
                                    throw (new Error('NO authms in dev mode'));
                                    callback(null,"one");
                                }
                            }
                        });
                    }else{
                        throw (new Error('NO authms in dev mode'));
                        callback(null,"one");
                    }
                }
            });
        },
        function(callback){ // create admins and app type tokens
            var users=conf.testConfig.adminokens;
            var usersId=[];
            async.eachSeries(users,function(tokenT,clb){
                var rqparams={
                    url:url+"/usertypes",
                    headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.auth_token},
                    body:JSON.stringify({usertype:{name:tokenT}})
                };
                request.post(rqparams, function(error, response, body){
                    console.log("USER TOKEN "+body);
                    if(error) {
                        throw err;
                        clb("err");
                    }else{
                        usersId.push(JSON.parse(body)._id);
                        clb();
                    }
                });

            },function(err){
                conf.testConfig.usersId=usersId;
                console.dir(conf.testConfig.usersId);
                callback(null,"two");
            });

        },
        function(callback){// create Authorized(webUI) app Type type tokens
            var apps=conf.testConfig.authApptokens.concat(conf.testConfig.apptokens);
            var appsId=[];
            conf.AdminAuthorizedApp=conf.AdminAuthorizedApp.concat(conf.testConfig.authApptokens);
            async.eachSeries(apps,function(tokenT,clb){
                var rqparams={
                    url:url+"/apptypes",
                    headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.auth_token},
                    body:JSON.stringify({apptype:{name:tokenT}})
                };
                request.post(rqparams, function(error, response, body){
                    console.log("APP TOKEN "+body);
                    if(error) {
                        throw err;
                        clb("err");
                    }else{
                        appsId.push(JSON.parse(body)._id);
                        clb();
                    }
                });

            },function(err){
                conf.testConfig.appsId=appsId;
                console.dir(conf.testConfig.appsId);
                callback(null,"three");
            });
        },
        function(callback){// create webUiToken

            var appBody = JSON.stringify({app:conf.testConfig.webUiAppTest});

            request.post({
                url: url + "/authapp/signup",
                body: appBody,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.auth_token}
            }, function (error, response,body) {
                if(error) {
                    throw err;
                    callback(error,null);
                }else{
                    var results = JSON.parse(response.body);
                    if(!results.error) {
                        conf.testConfig.myWebUITokenToSignUP = results.apiKey.token;
                        conf.testConfig.webUiID=results.userId;
                    }

                    callback(null,"five");
                }
            });

        },
        function(callback){ // create Auth Roles
            var roles=conf.testConfig.AuthRoles;
            async.forEachOf(roles,function(value,key,clb){
                var rqparams={
                    url:url+"/authms/authendpoint",
                    headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.auth_token},
                    body:JSON.stringify({microservice:{name:"userms",URI:value.URI, authToken:value.token, method:value.method}})
                };
                //console.log("ROLE: " + value.method + " ---> " + value.URI);
                request.post(rqparams, function(error, response, body){
                    console.log("#######################" + rqparams.body + " ---> " + body);
                    if(error) {
                        throw err;
                        clb("err");
                    }else{
                        value.id=JSON.parse(body)._id;
                        clb();
                    }
                });

            },function(err){
                conf.testConfig.AuthRoles=roles;
                console.dir(conf.testConfig.AuthRoles);
                callback(null,"four");
            });

        }
    ],function(err,resp){
        if(err)
            doneCallback(err);
        else
            doneCallback();
    });
}

exports.resetAuthMsStatus = function(callback) {

    async.series([
        function(clb){
            request.del({
                url: authHost + "/authapp/" + conf.testConfig.webUiID,
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.auth_token}
            }, function (error, response,body) {
                if(error) {
                    clb(error,"ONE");
                }else{
                    clb(null,"ONE");
                }
            });
        },
        function(clb){
            var roles=conf.testConfig.AuthRoles;
            async.forEachOf(roles,function(value,key,clbeach){
                var rqparams={
                    url: authHost + "/authms/authendpoint/" + value.id,
                    headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.auth_token}
                };
                //console.log("ROLE: " + value.method + " ---> " + value.URI);
                request.delete(rqparams, function(error, response, body){
                    //console.log(body);
                    if(error) {
                        clbeach(error);
                    }else{
                        clbeach();
                    }
                });

            },function(err){
                if(err)
                    clb(err,"TWO");
                else
                    clb(null,"TWO");
            });
        },
        function(clb){

            var roles=conf.testConfig.appsId;
            async.forEachOf(roles,function(value,key,clbeach){
                var rqparams={
                    url: authHost + "/apptypes/" + value,
                    headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.auth_token}
                };
                //console.log("ROLE: " + value.method + " ---> " + value.URI);
                console.log("####### CLEAN APPS TYPE ########")
                request.delete(rqparams, function(error, response, body){
                    //console.log(body);
                    if(error) {
                        clbeach(error);
                    }else{
                        console.log(body);
                        clbeach();
                    }
                });

            },function(err){
                if(err)
                    clb(err,"THREE");
                else
                    clb(null,"THREE");
            });
        },
        function(clb){
            var roles=conf.testConfig.usersId;
            async.forEachOf(roles,function(value,key,clbeach){
                var rqparams={
                    url: authHost + "/usertypes/" + value,
                    headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.auth_token}
                };
                console.log("####### CLEAN USERS TYPE ########")
                request.delete(rqparams, function(error, response, body){
                    //console.log(body);
                    if(error) {
                        clbeach(error);
                    }else{
                        console.log(body);
                        clbeach();
                    }
                });

            },function(err){
                if(err)
                    clb(err,"FOUR");
                else
                    clb(null,"FOUR");
            });
        }
    ],function(err,respo){
        if(err)
            throw (err);
        else{
            server.close();
            db.disconnect(function (err,res) {
                if (err) console.log("######   ERRORE After 2: " + err +"  ######");
                callback(null);
            });
        }
    });


    
};


//exports.getMyToken = function() {
//
//                conf.MyMicroserviceToken="yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoibXMiLCJpc3MiOiJub3QgdXNlZCBmbyBtcyIsImVtYWlsIjoibm90IHVzZWQgZm8gbXMiLCJ0eXBlIjoiQXV0aE1zIiwiZW5hYmxlZCI6dHJ1ZSwiZXhwIjoxNzgwODM0NTQxMzQxfQ.gJkSUCAkqzIb52s2ITohj7vXx-EXpicObSaJ1uSgdog";
//                return(conf);
//};