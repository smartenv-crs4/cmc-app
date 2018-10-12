/*
 ############################################################################
 ############################### GPL III ####################################
 ############################################################################
 *                         Copyright 2017 CRS4                                 *
 *       This file is part of CRS4 Microservice Core - Auth (CMC-Auth).       *
 *                                                                            *
 *       CMC-Auth is free software: you can redistribute it and/or modify     *
 *     it under the terms of the GNU General Public License as published by   *
 *       the Free Software Foundation, either version 3 of the License, or    *
 *                    (at your option) any later version.                     *
 *                                                                            *
 *       CMC-Auth is distributed in the hope that it will be useful,          *
 *      but WITHOUT ANY WARRANTY; without even the implied warranty of        *
 *       MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the        *
 *               GNU General Public License for more details.                 *
 *                                                                            *
 *       You should have received a copy of the GNU General Public License    *
 *       along with CMC-Auth.  If not, see <http://www.gnu.org/licenses/>.    *
 * ############################################################################
 */

var redis=require('redis');
var conf = require('../config').conf;
var _=require('underscore');


var adminUserSync={

    "channelToParam":{},
    "pendingSubscriptions":[],
    "unsubscribe":function(){
    },

    "quit":function(){

    },
    "subscribe":function(channel,param){
        adminUserSync.pendingSubscriptions.push({channel:channel,param:param});
    },
    "setup":function(){

        var redisConf=conf.redisCache || null;
        if(!redisConf.password)
            delete redisConf.password;

        var redisClient = redis.createClient(redisConf);

        redisClient.on("ready", function (err) {

            adminUserSync.unsubscribe=function(){
                _.each(adminUserSync.channelToParam, function(value,key){
                    redisClient.unsubscribe(key);
                });
                adminUserSync.channelToParam={};
            };

            adminUserSync.quit=function(){
                adminUserSync.unsubscribe();
                redisClient.quit();
            };

            adminUserSync.subscribe=function(channel,param){
                   redisClient.subscribe(channel);
                   adminUserSync.channelToParam[channel]=param;
            };

            _.each(adminUserSync.pendingSubscriptions,function(val){
               adminUserSync.subscribe(val.channel,val.param);
            });
        });

        redisClient.on("error", function (err) {
            console.log("Error in redisSync " + err);
        });

        redisClient.on("subscribe", function (channel, count) {
            console.log("Subscribed to Redis channel " + channel);
        });

        redisClient.on("message", function (channel, message) {
            console.log("**********************************************");
            console.log("messagge on channel " + channel + ": " + message);
            console.log("**********************************************");
            // conf.adminUser=JSON.parse(message);
            conf[adminUserSync.channelToParam[channel]]=JSON.parse(message);

            console.log(conf.adminUser);
            console.log(conf.AdminAuthorizedApp);

        });
    }
};


module.exports = adminUserSync;



