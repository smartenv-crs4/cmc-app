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
var clientUser;
var applicationId;
var appStandard = conf.testConfig.appTypeTest;
var commonFunctioTest=require("./testCommonfunctions");



describe('Apps API', function () {

    // before(function (done) {
    //     //this.timeout(4000);
    //     //
    //     //console.log("BEFORE");
    //     db.connect(function (err) {
    //         if (err) console.log("######   ERRORE BEFORE : " + err +"  ######");
    //
    //         app.set('port', process.env.PORT || Port);
    //
    //         server = app.listen(app.get('port'), function () {
    //             console.log('TEST Express server listening on port ' + server.address().port);
    //             done();
    //         });
    //     });
    // });
    //
    // after(function (done) {
    //     //console.log("AFTER");
    //     Apps.remove({}, function (err,elm) {
    //         if (err) console.log("######   ERRORE After 1: " + err +"  ######");
    //         db.disconnect(function (err,res) {
    //             if (err) console.log("######   ERRORE After 2: " + err +"  ######");
    //             done();
    //         });
    //         server.close();
    //     });
    // });


    before(function (done) {
        commonFunctioTest.setAuthMsMicroservice(function(err){
            if(err) throw (err);
            done();
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
                avatar:"surname"+e
            }, function (err, newuser) {
                if (err) console.log("######   ERRORE BEFOREEACH: " + err +"  ######");
                //console.log(e);
                if(e==1) clientUser=newuser._id;
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
            if(applicationId)
                deleteFromAuth(applicationId,done);
            else done();
        });
    });


    function deleteFromAuth(id,done){
        var gw=_.isEmpty(conf.apiGwAuthBaseUrl) ? "" : conf.apiGwAuthBaseUrl + "/" + conf.apiVersion;
        gw=_.isEmpty(conf.apiVersion) ? gw : gw + "/" + conf.apiVersion;
        var url = conf.authProtocol + "://" + conf.authHost + ":" + conf.authPort + gw + '/authapp/'+id;
        applicationId=null;
        request.delete({
            url: url,
            headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.auth_token}
        },function(error, response, body){
            if(error) {
                console.log("######   ERRORE: " + error + "  ######");
                done();
            }
            else{
                response.statusCode.should.be.equal(200);
                done();
            }
        });
    }





    describe('GET /authuser', function () {

        it('must return  error 400 for invalid token', function (done) {

            request.get({
                url: APIURL + '?skip=0&limit=2',
                headers: {'Authorization': "Bearer " + conf.testConfig.myWebUITokenToSignUP + "d"}
            }, function (error, response, body) {

                if (error) console.log("######   ERRORE: " + error +"  ######");
                else {
                    var results = JSON.parse(body);
                    console.log("InvalidToken: " + body );
                    response.statusCode.should.be.equal(401);
                    results.should.have.property('error');
                    results.should.have.property('error_message');
                    results.error_message.should.be.equal("The decode_token is invalid or malformed");
                }
                done();
            });
        });
    });



    describe('GET /authuser', function () {

        it('must return  error 400 for Access_token required', function (done) {

            request.get({url: APIURL + '?skip=0&limit=2'}, function (error, response, body) {

                if (error) console.log("######   ERRORE: " + error +"  ######");
                else {
                    var results = JSON.parse(body);
                    console.log("accessTokenRequired: " + body );
                    response.statusCode.should.be.equal(400);
                    results.should.have.property('error');
                    results.should.have.property('error_message');
                    results.error_message.should.be.equal("Unauthorized: Access token required, you are not allowed to use the resource");
                }
                done();
            });
        });
    });





    describe('GET /authuser', function () {
        this.timeout(10000);

        try {
            it('must return  error 401 for Unauthorized token', function (done) {
               // console.log("test 2 start");
                var userBody = JSON.stringify({application:appStandard});
               // console.log("BODY " + userBody);
                var url = APIURL + '/signup';
                var results;




                request.post({
                    url: url,
                    body: userBody,
                    headers: {'content-type': 'application/json', 'Authorization': "Bearer " + conf.testConfig.myWebUITokenToSignUP}
                }, function (error, response,body) {
                    if (error) console.log("######   ERRORE 401 1: " + error + "  ######");
                    else {
                        console.log("UnauthorizesToken: " + body );
                        response.statusCode.should.be.equal(201);
                        var results = JSON.parse(response.body);
                        results.should.have.property('access_credentials');
                        results.should.have.property('created_resource');
                        applicationId=results.created_resource._id; // nedeed to cancel user
                    }
                   // console.log("ENDONE");

                    request.get({
                        url: APIURL + '?skip=0&limit=2',
                        headers: {'Authorization': "Bearer " + results.access_credentials.apiKey.token}
                    }, function (error, response, body) {

                        if (error) console.log("######   ERRORE: 401 2 " + error + "  ######");
                        else {
                           // console.log("BODYBODY" + body);
                            results = JSON.parse(body);
                            response.statusCode.should.be.equal(401);
                            results.should.have.property('error');
                            results.should.have.property('error_message');
                            results.error_message.should.be.equal("Only admin token types can access this resource");
                        }
                      //  console.log("ENDTWO");
                       // console.log("test 2 end");
                        done();
                    });
                });

            });
        }catch (err){
           // console.log("TIENI " + err);

        }
    });
});
