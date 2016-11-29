
function customTestConfig(config){

    var testConfig=config.testConfig;

    var adminAppToken=testConfig.adminokens.concat(testConfig.apptokens);
    var adminAuthAppToken=testConfig.adminokens.concat(testConfig.authApptokens);
    var adminAppAuthAppToken=testConfig.adminokens.concat(testConfig.authApptokens).concat(testConfig.apptokens);

    testConfig.myWebUITokenToSignUP=config.MyMicroserviceToken;
    testConfig.appTypeTest = {
                    "name": "Micio",
                    "email": "mario@caport.com",
                    "password": "miciomicio",
                    "avatar":"noAvatar",
                    "type":testConfig.apptokens[0]
    };
    testConfig.webUiAppTest={
                  "email": "webui@webui.it",
                  "password": "miciomicio",
                  "type": testConfig.authApptokens[0]
    };
    testConfig.adminLogin={
                  "username": "admin@admin.com",
                  "password": "admin"
    };

    testConfig.AuthRoles = [
        {URI: "/users/signin", token: testConfig.authApptokens, method: "POST"},
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
        {URI: "/apps/actions/email/find/:term", token: testConfig.adminokens, method: "GET"}
    ];
    testConfig.webUiID="";
}



module.exports.customTestConfig = customTestConfig;

