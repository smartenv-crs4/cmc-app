var should = require('should');
var mongoose = require('mongoose');
var _ = require('underscore')._;
var async = require('async');
var db = require("../models/db");
var Apps = require('../models/apps').App;
var conf = require('../config').conf;

var request = require('request');

var app = require('../app');
var util = require('util');


var Port = 3020;
var APIURL = 'http://localhost:' + Port +"/apps" ;




var adminToken;
var clientApp;
var clientId;
var UserMSURL = conf.userProtocol + "://" + conf.userHost + ":" + conf.userPort + "/users";
var commonFunctioTest=require("./testCommonfunctions");



var appStandard = conf.testConfig.appTypeTest;


describe('Apps API', function () {

    before(function (done) {
        //this.timeout(4000);
        //
        //console.log("BEFORE");


        commonFunctioTest.setAuthMsMicroservice(function(err){
           if(err) throw (err);
            var url = UserMSURL + '/signin';

            console.log("!!!!!!!!!!" + url);
            request.post({
                url: url,
                body: JSON.stringify(conf.testConfig.adminLogin),
                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.testConfig.myWebUITokenToSignUP}
            }, function (error, response,body) {
                if (error) console.log("######  2 ERRORE should  login a Authapp: " + error +"  ######");
                else {
                    console.log("GET ADMIN TOKEN " + body);
                    response.statusCode.should.be.equal(200);
                    var results = JSON.parse(response.body);
                    results.should.have.property('access_credentials');
                    adminToken=results.access_credentials.apiKey.token;
                    console.log("ADMINTOKEN " + adminToken);
                }
                done();
            });
        });

    });

    after(function (done) {
        //console.log("AFTER");
        Apps.remove({}, function (err, elm) {
            if (err) console.log("######   ERRORE After 1: " + err +"  ######");
            commonFunctioTest.resetAuthMsStatus(function(err){
                if (err) console.log("######   ERRORE After 1: " + err +"  ######");
                done();
            });
        });
    });


    beforeEach(function (done) {

        var range = _.range(100);

        //Add cars
       // console.log("BEFORE EACH");
        async.each(range, function (e, cb) {

            Apps.create({
                _id : new mongoose.Types.ObjectId,
                email:"email" + e + "@email.it",
                name:"name" +e,
                avatar:"avatar"+e
            }, function (err, newapp) {
                if (err) console.log("######   ERRORE BEFOREEACH: " + err +"  ######");
                //console.log(e);
                if(e==1) clientApp=newapp._id;
                cb();
            });

        }, function (err) {
            done();
        });
    });


    afterEach(function (done) {
        //console.log("AFTER EACH");
        Apps.remove({}, function (err, elm) {
            if (err) console.log("######   ERRORE AfterEach: " + err +"  ######");
            if(clientId)
                deleteFromAuth(clientId,done);
            else done();
        });
    });





    describe('GET /app', function () {

        it('must return ONE app and _metadata, all fields', function (done) {

           // console.log("SEND TEST");

            request.get({
                url: APIURL + '?skip=0&limit=1',
                headers: {'Authorization': "Bearer " + adminToken}
            }, function (error, response, body) {

                if (error) console.log("######   ERRORE: " + error +"  ######");
                else {
                    //console.log("ERR MSG:" + body);
                    response.statusCode.should.be.equal(200);
                    var results = JSON.parse(body);

                    results.should.have.property('_metadata');
                    results.should.have.property('apps');
                    results._metadata.skip.should.be.equal(0);
                    results._metadata.limit.should.be.equal(1);
                    results._metadata.totalCount.should.be.equal(100);
                    //should.exist(results.apps[0].hash);
                    //should.exist(results.apps[0].salt);
                    should.exist(results.apps[0].email);
                    should.exist(results.apps[0].name);
                    should.exist(results.apps[0].avatar);

                }
                done();
            });

        });

    });


    describe('GET /authapp', function () {

        it('must return 2 apps and _metadata, all fields', function (done) {

            request.get({
                url: APIURL + '?skip=0&limit=2',
                headers: {'Authorization': "Bearer " + adminToken}
            }, function (error, response, body) {

                if (error) console.log("######   ERRORE: " + error +"  ######");
                else {
                    //console.log("ERR MSG:" + body);
                    response.statusCode.should.be.equal(200);
                    var results = JSON.parse(body);

                    results.should.have.property('_metadata');
                    results.should.have.property('apps');
                    results._metadata.skip.should.be.equal(0);
                    results._metadata.limit.should.be.equal(2);
                    results._metadata.totalCount.should.be.equal(100);
                    //should.exist(results.apps[0].hash);
                    //should.exist(results.apps[0].salt);
                    should.exist(results.apps[0].email);
                    should.exist(results.apps[0].name);
                    should.exist(results.apps[0].avatar);
                }
                done();
            });
        });
    });



    describe('GET /authapp', function () {

        it('must return  error 400 for invalid token', function (done) {

            request.get({
                url: APIURL + '?skip=0&limit=2',
                headers: {'Authorization': "Bearer " + conf.testConfig.myWebUITokenToSignUP + "d"}
            }, function (error, response, body) {

                if (error) console.log("######   ERRORE: " + error +"  ######");
                else {
                    var results = JSON.parse(body);
                    response.statusCode.should.be.equal(401);
                    results.should.have.property('error');
                    results.should.have.property('error_message');
                }
                done();
            });
        });
    });


    describe('GET /authapp', function () {

        it('must return  error 401 for not Autthorized token', function (done) {

            request.get({
                url: APIURL + '?skip=0&limit=2',
                headers: {'Authorization': "Bearer " + conf.testConfig.myWebUITokenToSignUP}
            }, function (error, response, body) {

                if (error) console.log("######   ERRORE: " + error +"  ######");
                else {
                    var results = JSON.parse(body);
                    response.statusCode.should.be.equal(401);
                    results.should.have.property('error');
                    results.should.have.property('error_message');
                }
                done();
            });
        });
    });







    describe('GET /authapp', function () {

        it('must return  no error for invalid field', function (done) {

            request.get({
                url: APIURL + '?skip=0&limit=2&fields=name,codFisc',
                headers: {'Authorization': "Bearer " + adminToken}
            }, function (error, response, body) {

                if (error) console.log("######   ERRORE: " + error +"  ######");
                else {
                    //console.log("EREWREWREWRWEREW " +body);
                    response.statusCode.should.be.equal(200);
                    var results = JSON.parse(body);
                    results.should.have.property('_metadata');
                    results.should.have.property('apps');
                    should.not.exist(results.apps[0].email);
                    should.exist(results.apps[0].name);
                    should.not.exist(results.apps[0].codFisc);
                    should.not.exist(results.apps[0].salt);
                }
                done();
            });
        });
    });





    describe('GET /authapp', function () {

        it('must return  error 400 for Access_token required', function (done) {

            request.get({url: APIURL + '?skip=0&limit=2'}, function (error, response, body) {

                if (error) console.log("######   ERRORE: " + error +"  ######");
                else {
                    var results = JSON.parse(body);
                    //console.log("ERRMSG" + results.error_message)
                    response.statusCode.should.be.equal(400);
                    results.should.have.property('error');
                    results.should.have.property('error_message');
                }
                done();
            });
        });
    });


    function deleteFromAuth(id,done){
        var url = conf.authProtocol + "://" + conf.authHost + ":" + conf.authPort + '/authapp/'+id;
        clientId=null;
        request.delete({
            url: url,
            headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.MyMicroserviceToken}
        },function(error, response, body){
            if(error) {
                console.log("######   ERRORE: " + error + "  ######");
                done();
            }
            else{
                should(response.statusCode==200 || response.statusCode==404).be.true;
                done();
            }
        });
    }

    function createUser(callb){
        var appBody = JSON.stringify({application:appStandard});
        //console.log("BODY " + userBody);
        var url = APIURL + '/signup';
        request.post({
            url: url,
            body: appBody,
            headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.testConfig.myWebUITokenToSignUP}
        }, function (error, response,body) {
            if (error) console.log("######  1 ERRORE should  login a Authapp: " + error +"  ######");
            else {
                console.log(body);
                response.statusCode.should.be.equal(201);
                var results = JSON.parse(response.body);
                results.should.have.property('access_credentials');
                results.should.have.property('created_resource');
                clientId=results.created_resource._id; // nedeed to cancel app
            }
            callb(results.access_credentials.apiKey.token || null);
        });
    }


    
    describe('GET /authapp/:id', function(){
    
        it('must return a app by id, all fields', function(done){
            createUser(function(token){
                if(token){
                    var url = APIURL+'/'+clientId;
                    request.get({url:url,headers:{'Authorization' : "Bearer "+ token}},function(error, response, body){
                        if(error) console.log("######   ERRORE: 401 2 " + error + "  ######");
                        else{
                            console.log(body);
                            response.statusCode.should.be.equal(200);
                            var results = JSON.parse(response.body);
                            results.should.have.property('email');
                            results.should.have.property('name');
                            results.should.not.have.property('password');
                        }
                        done();
                    });
                }else{
                    token.should.be.not(null);
                }
            })

        });
    });


    describe('GET /authapp/:id', function(){

        it('must return a app by id, fields type', function(done){
            createUser(function(token){
                if(token){
                    var url = APIURL+'/'+clientId+"?fields=name";
                    request.get({url:url,headers:{'Authorization' : "Bearer "+ token}},function(error, response, body){
                        if(error) console.log("######   ERRORE: 401 2 " + error + "  ######");
                        else{
                            response.statusCode.should.be.equal(200);
                            var results = JSON.parse(response.body);
                            results.should.not.have.property('email');
                            results.should.have.property('name');
                            results.should.not.have.property('surname');
                            results.should.not.have.property('salt');
                        }
                        done();
                    });
                }else{
                    token.should.be.not(null);
                }
            })

        });
    });

    describe('GET /authapp/:id', function(){

        it('must return a app by id, send an invalid field', function(done){
            createUser(function(token){
                if(token){
                    var url = APIURL+'/'+clientId+"?fields=name,codfiscale";
                    request.get({url:url,headers:{'Authorization' : "Bearer "+ token}},function(error, response, body){
                        if(error) console.log("######   ERRORE: 401 2 " + error + "  ######");
                        else{
                            response.statusCode.should.be.equal(200);
                            var results = JSON.parse(response.body);
                            results.should.not.have.property('email');
                            results.should.have.property('name');
                            results.should.not.have.property('surname');
                            results.should.not.have.property('salt');
                            results.should.not.have.property('codfiscale');
                        }
                        done();
                    });
                }else{
                    token.should.be.not(null);
                }
            })

        });
    });





    describe('GET /authapp/:id', function(){

        it('must return a 404, app not found', function(done){
            createUser(function(token){
                if(token){
                    var url = APIURL+'/'+clientId+"abc?fields=name,codfiscale";
                    request.get({url:url,headers:{'Authorization' : "Bearer "+ adminToken}},function(error, response, body){
                        if(error) console.log("######   ERRORE: 401 2 " + error + "  ######");
                        else{
                            console.log("404ERR " + body);
                            response.statusCode.should.be.equal(404);
                        }
                        done();
                    });
                }else{
                    token.should.be.not(null);
                }
            })

        });
    });



    describe('GET /authapp/:id', function(){

        it('must return a 401, app with invalid ID', function(done){
            createUser(function(token){
                if(token){
                    var url = APIURL+'/'+clientId+"abc?fields=name,codfiscale";
                    request.get({url:url,headers:{'Authorization' : "Bearer "+ token}},function(error, response, body){
                        if(error) console.log("######   ERRORE: 401 2 " + error + "  ######");
                        else{
                            console.log("404ERR " + body);
                            response.statusCode.should.be.equal(401);
                        }
                        done();
                    });
                }else{
                    token.should.be.not(null);
                }
            })

        });
    });




    describe('DELETE /app/:id', function(){

        it('must delete a app by id', function(done){
            createUser(function(token){
                if(token){
                    var url = APIURL+'/'+clientId;
                    request.delete({url:url,headers:{'Authorization' : "Bearer "+ adminToken}},function(error, response, body){
                        if(error) {
                            console.log("######   ERRORE: " + error + "  ######");
                            done()
                        }
                        else{
                            console.log("404ERR " + body);
                            response.statusCode.should.be.equal(204);
                            Apps.findOne({id:clientId}, function(err, usr){

                                should(usr).be.equal(null);
                                done();
                            });
                        }
                    });
                }else{
                    token.should.be.not(null);
                }
            })

        });
    });


    describe('DELETE /app/:id', function(){

        it('must return error 404 in delete a app by invalid id', function(done){
            createUser(function(token){
                if(token){
                    var url = APIURL+'/'+"ABC";
                    request.delete({url:url,headers:{'Authorization' : "Bearer "+ adminToken}},function(error, response, body){
                        if(error) {
                            console.log("######   ERRORE: " + error + "  ######");
                            done()
                        }
                        else{
                            console.log("404ERR " + body);
                            response.statusCode.should.be.equal(500);
                            done();
                        }
                    });
                }else{
                    token.should.be.not(null);
                }
            })

        });
    });







    describe('GET /authapp/:id', function(){

        it('must disable and enable a App', function(done){
            createUser(function(tokenUtente){
                if(tokenUtente){
                    var url = APIURL+'/'+clientId+"/actions/disable";
                    request.post({url:url,headers:{'Authorization' : "Bearer "+ adminToken}},function(error, response, body){
                        if(error) console.log("######   ERRORE: 401 2 " + error + "  ######");
                        else{
                            response.statusCode.should.be.equal(201);
                            console.log("#####AFTERDISAVBLE##### " + body);

                            var url = APIURL + '/signin';
                            var app = {
                                "username": "mario@caport.com",
                                "password": "miciomicio"
                            };
                            var appBody = JSON.stringify(app);

                            request.post({
                                url: url,
                                body: appBody,
                                headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.testConfig.myWebUITokenToSignUP}
                            }, function (error, response,body) {
                                if (error) console.log("######  2 ERRORE should  login a Authapp: " + error +"  ######");
                                else {

                                    response.statusCode.should.be.equal(200);
                                    var url = APIURL+'/'+clientId+"?fields=name";
                                    request.get({url:url,headers:{'Authorization' : "Bearer "+ tokenUtente}},function(error, response, body){
                                        if(error) console.log("######   ERRORE: 401 2 " + error + "  ######");
                                        else{
                                            response.statusCode.should.be.equal(401);
                                            var url = APIURL+'/'+clientId+"/actions/enable";
                                            request.post({url:url,headers:{'Authorization' : "Bearer "+ adminToken}},function(error, response, body){
                                                if(error) console.log("######   ERRORE: 401 2 " + error + "  ######");
                                                else{
                                                    response.statusCode.should.be.equal(201);
                                                    var url = APIURL+'/'+clientId+"?fields=name";
                                                    request.get({url:url,headers:{'Authorization' : "Bearer "+ tokenUtente}},function(error, response, body){
                                                        if(error) console.log("######   ERRORE: 401 2 " + error + "  ######");
                                                        else{
                                                            response.statusCode.should.be.equal(200);
                                                            var results = JSON.parse(response.body);
                                                            results.should.not.have.property('email');
                                                            results.should.have.property('name');
                                                            results.should.not.have.property('surname');
                                                            results.should.not.have.property('salt');
                                                        }
                                                        done();
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }else{
                    tokenUtente.should.be.not(null);
                }
            })
        });
    });

});
