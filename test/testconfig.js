/*
 ############################################################################
 ############################### GPL III ####################################
 ############################################################################
 *                  Copyright 2017 CRS4                                      *
 *   This file is part of CRS4 Microservice Core - Application (CMC-App).   *
 *                                                                          *
 *     CMC-App is free software: you can redistribute it and/or modify      *
 *   it under the terms of the GNU General Public License as published by   *
 *    the Free Software Foundation, either version 3 of the License, or     *
 *                (at your option) any later version.                       *
 *                                                                          *
 *        CMC-App is distributed in the hope that it will be useful,        *
 *      but WITHOUT ANY WARRANTY; without even the implied warranty of      *
 *       MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the      *
 *              GNU General Public License for more details.                *
 *                                                                          *
 *     You should have received a copy of the GNU General Public License    *
 *     along with CMC-App.  If not, see <http://www.gnu.org/licenses/>.     *
 ############################################################################
 */


function customTestConfig(config) {

    var testConfig = config.testConfig;

    var adminAppToken = testConfig.adminokens.concat(testConfig.apptokens);
    var adminAuthAppToken = testConfig.adminokens.concat(testConfig.authApptokens);
    var adminAppAuthAppToken = testConfig.adminokens.concat(testConfig.authApptokens).concat(testConfig.apptokens);

    testConfig.myWebUITokenToSignUP = config.auth_token;
    testConfig.appTypeTest.type= testConfig.apptokens[0];
    testConfig.webUiAppTest.type= testConfig.authApptokens[0];

    testConfig.AuthRoles = [
        {URI: "/users/signin", token: testConfig.authApptokens, method: "POST",ms:config.testConfig.userMsName},
        {URI: "/apps", token: testConfig.adminokens, method: "GET"},
        {URI: "/apps", token: testConfig.adminokens, method: "POST"},
        {URI: "/apps/:id", token: adminAppToken, method: "GET"},
        {URI: "/apps/:id", token: adminAppToken, method: "PUT"},
        {URI: "/apps/:id", token: testConfig.adminokens, method: "DELETE"},
        {URI: "/apps/signup", token: adminAuthAppToken, method: "POST"},
        {URI: "/apps/signin", token: testConfig.authApptokens, method: "POST"},
        {URI: "/apps/:id/actions/resetpassword", token: adminAuthAppToken, method: "POST"},
        {URI: "/apps/:id/actions/setpassword", token: adminAppAuthAppToken, method: "POST"},
        {URI: "/apps/:id/actions/changeuserid", token: testConfig.adminokens, method: "POST"},
        {URI: "/apps/:id/actions/enable", token: testConfig.adminokens, method: "POST"},
        {URI: "/apps/:id/actions/disable", token: testConfig.adminokens, method: "POST"},
        {URI: "/apps/actions/email/find/:term", token: testConfig.adminokens, method: "GET"},
        {URI: "/apps/actions/search",token:testConfig.adminokens, method:"post"}
    ];
    testConfig.webUiID = "";
}


module.exports.customTestConfig = customTestConfig;

