var testCustomizableParams={
    //usersType:["UserType1"],
    appsType:["AppType1"],
    adminusersType:["admin"],
    authAppTypes:["webui"],
    appmsToken:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoibXMiLCJpc3MiOiJub3QgdXNlZCBmbyBtcyIsImVtYWlsIjoibm90IHVzZWQgZm8gbXMiLCJ0eXBlIjoidXNlcm1zIiwiZW5hYmxlZCI6dHJ1ZSwiZXhwIjoxNzg5OTk2OTE5MzEyfQ.P78RVNGK9m0pY1nehyDGd8v-q28y_43GMECluzNTbEw"
};

var adminAppToken=testCustomizableParams.adminusersType.concat(testCustomizableParams.appsType);
var adminAuthAppToken=testCustomizableParams.adminusersType.concat(testCustomizableParams.authAppTypes);
var adminAppAuthAppToken=testCustomizableParams.adminusersType.concat(testCustomizableParams.authAppTypes).concat(testCustomizableParams.appsType);

var config = {

  dev:{
        dbHost:'localhost',
        dbPort:'27017',
        dbName:'CP2020APPDEV',
        limit:50,
        skip:0,
        logfile:"/var/log/caport2020User-Microservice.log",
        adminUser:["admin"],
        AdminAuthorizedApp:["webuims"], // signUp & Login
        microserviceAuthMS:"http://localhost:3005",
        microserviceUserMs : "http://localhost:3010",
        MyMicroserviceToken:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoibXMiLCJpc3MiOiJub3QgdXNlZCBmbyBtcyIsImVtYWlsIjoibm90IHVzZWQgZm8gbXMiLCJ0eXBlIjoiYXBwbXMiLCJlbmFibGVkIjp0cnVlLCJleHAiOjE3ODg2MTgxMDgwMDJ9.4V6ErKZrPFG_N5uen8dQFpUs8QVOmG_3BLr-JWw-3BA",
        testConfig:{
              apptokens:testCustomizableParams.appsType,
              authApptokens:testCustomizableParams.authAppTypes,
              adminokens:testCustomizableParams.adminusersType,
              myWebUITokenToSignUP:testCustomizableParams.appmsToken,
              // userTypeTest:{
              //     "name": "Micio",
              //     "email": "mario@caport.com",
              //     "password": "miciomicio",
              //     "surname":"Macio",
              //     "type": testCustomizableParams.usersType[0]
              // },
              appTypeTest : {
                    "name": "Micio",
                    "email": "mario@caport.com",
                    "password": "miciomicio",
                    "avatar":"noAvatar",
                    "type":testCustomizableParams.appsType[0]
              },
              webUiAppTest:{
                  "email": "webui@webui.it",
                  "password": "miciomicio",
                  "type": testCustomizableParams.authAppTypes[0]
              },
              adminLogin:{
                  "username": "admin@admin.com",
                  "password": "admin"
              },
              AuthRoles:[
                  {URI:"/users/signin",token:testCustomizableParams.authAppTypes, method:"POST"},

                  {URI:"/apps", token:testCustomizableParams.adminusersType, method:"GET"},
                  {URI:"/apps",token:testCustomizableParams.adminusersType, method:"POST"},
                  {URI:"/apps/:id",token:adminAppToken, method:"GET"},
                  {URI:"/apps/:id",token:adminAppToken, method:"PUT"},
                  {URI:"/apps/:id",token:testCustomizableParams.adminusersType, method:"DELETE"},
                  {URI:"/apps/signup",token:adminAuthAppToken, method:"POST"},
                  {URI:"/apps/signin",token:testCustomizableParams.authAppTypes, method:"POST"},
                  {URI:"/apps/:id/actions/resetpassword",token:adminAuthAppToken, method:"POST"},
                  {URI:"/apps/:id/actions/setpassword",token:adminAppAuthAppToken, method:"POST"},
                  {URI:"/apps/:id/actions/changeuserid",token:testCustomizableParams.adminusersType, method:"POST"},
                  {URI:"/apps/:id/actions/enable",token:testCustomizableParams.adminusersType, method:"POST"},
                  {URI:"/apps/:id/actions/disable",token:testCustomizableParams.adminusersType, method:"POST"},
                  {URI:"/apps/actions/email/find/:term",token:testCustomizableParams.adminusersType, method:"GET"}
              ],
              webUiID:""
        }
  },

  production:{

        dbHost:'localhost',
        dbPort:'27017',
        dbName:'CP2020APP',
        limit:50,
        skip:0,
        logfile:"/var/log/caport2020User-Microservice.log",
        adminUser:["admin"],
        AdminAuthorizedApp:["webuims"], // signUp & Login
        microserviceAuthMS:"http://localhost:3005",
        MyMicroserviceToken:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoibXMiLCJpc3MiOiJub3QgdXNlZCBmbyBtcyIsImVtYWlsIjoibm90IHVzZWQgZm8gbXMiLCJ0eXBlIjoiVXNlcnNTZXJ2aWNlIiwiZW5hYmxlZCI6dHJ1ZSwiZXhwIjoxNzgxNTQwOTUzMDg4fQ.s-TB-bKM4pGorAb2J4axkVHUrwEGLmtOF4vJpx6bt-M",
              //userType:["admin","crocierista" , "ente", "operatore"], //admin is a superuser then it must not be deleted or moved from position [0] in the array
       // appType:["webui", "ext", "user"] //webUi is an internal microservice then it must not be deleted or moved from position [0] in the array
  }


};

var conf;
if (process.env['NODE_ENV'] === 'dev') {
    conf = config.dev;
}
else{
    conf = config.production;
}

module.exports.conf = conf;
module.exports.generalConf = config;
