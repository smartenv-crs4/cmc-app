define({ "api": [
  {
    "type": "post",
    "url": "/signup",
    "title": "Register a new Application",
    "version": "1.0.0",
    "name": "Create_Application",
    "group": "Application",
    "description": "<p>Accessible by access_token of type specified in config.js SignUpAuthorizedAppAndMS field. It create a new Application object and return the access_credentials.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access_token to access to this resource. it must be sended in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "application",
            "description": "<p>the user dictionary with all the fields, only email, password and type are mandatory.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "HTTP/1.1 POST request\n Body:{ \"email\": \"prova@prova.it\" , \"password\":\"provami\", \"type\":\"ext\", \"name\":\"nome\"}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "201 - Created": [
          {
            "group": "201 - Created",
            "type": "Object",
            "optional": false,
            "field": "access_credentials",
            "description": "<p>contains information about access_credemtials.</p> "
          },
          {
            "group": "201 - Created",
            "type": "Object",
            "optional": false,
            "field": "access_credentials.apiKey",
            "description": "<p>contains information about apiKey</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "access_credentials.apiKey.token",
            "description": "<p>contains user Token</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "access_credentials.apiKey.expires",
            "description": "<p>contains information about token life</p> "
          },
          {
            "group": "201 - Created",
            "type": "Object",
            "optional": false,
            "field": "access_credentials.refreshToken",
            "description": "<p>contains information about refreshToken used to renew token</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "access_credentials.refreshToken.token",
            "description": "<p>contains user refreshToken</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "access_credentials.refreshToken.expires",
            "description": "<p>contains information about refreshToken life</p> "
          },
          {
            "group": "201 - Created",
            "type": "Object",
            "optional": false,
            "field": "Created_resource",
            "description": "<p>contains the created User resource</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "Created_resource.UserField_1",
            "description": "<p>Contains field 1 defined in Application Schema(example name)</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "Created_resource.UserField_2",
            "description": "<p>Contains field 2 defined in Application Schema(example surname)</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "Created_resource.UserField_N",
            "description": "<p>Contains field N defined in Application Schema(example type)</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 201 CREATED",
          "content": " HTTP/1.1 201 CREATED\n\n{\n   \"created_resource\":{\n            \"name\":\"Micio\",\n            \"email\":\"mario@caport.com\",\n            \"id\":\"57643332ab9293ff0b5da6f0\"\n   },\n   \"access_credentials\":{\n            \"apiKey\":{\n                    \"token\":\"VppR5sHU_hV3U\",\n                    \"expires\":1466789299072\n             },\n             \"refreshToken\":{\n                     \"token\":\"eQO7de4AJe-syk\",\n                     \"expires\":1467394099074\n              }\n   }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/apps.js",
    "groupTitle": "Application",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> not authorized to call this endpoint.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create WeUiMS</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p><b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR> <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p><b>ServerError:</b>Internal Server Error. <BR> <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    error:\"invalid_token\",\n    error_description:\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    error: 'Internal Error'\n    error_message: 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/:id",
    "title": "delete Application",
    "version": "1.0.0",
    "name": "Delete_Application",
    "group": "Application",
    "description": "<p>Accessible by access_token, It delete Application and return the deleted resource. To call this endpoint must have an admin token.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access_token to access to this resource. it must be sended in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the Application id to identify the Application</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "201 - Created": [
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "ApplicationField_1",
            "description": "<p>Contains field 1 defined in Application Schema(example name)</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "ApplicationField_2",
            "description": "<p>Contains field 2 defined in Application Schema(example notes)</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "ApplicationField_N",
            "description": "<p>Contains field N defined in Application Schema(example type)</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 201 CREATED",
          "content": " HTTP/1.1 204 DELETED\n\n{\n   \"name\":\"Micio\",\n   \"notes\":\"Macio\",\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/apps.js",
    "groupTitle": "Application",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> not authorized to call this endpoint.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create WeUiMS</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p><b>NotFound:</b> the Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifing the not Found Error.<BR> <b>request.body.erro_messager</b> contains an error message specifing the not Found Error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p><b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR> <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p><b>ServerError:</b>Internal Server Error. <BR> <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    error:\"invalid_token\",\n    error_description:\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    error: 'Internal Error'\n    error_message: 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/:id/actions/disable",
    "title": "disable Application",
    "version": "1.0.0",
    "name": "DisableApplication",
    "group": "Application",
    "description": "<p>Accessible by access_token, It disable the Application. To call this endpoint must have an admin token.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access_token to access to this resource. it must be sended in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the Application id to identify the Application</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "201 - Created": [
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>contains the new Application status</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 201 CREATED",
          "content": " HTTP/1.1 201 CREATED\n\n{\n   \"status\":\"disabled\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/apps.js",
    "groupTitle": "Application",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> not authorized to call this endpoint.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create WeUiMS</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p><b>NotFound:</b> the Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifing the not Found Error.<BR> <b>request.body.erro_messager</b> contains an error message specifing the not Found Error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p><b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR> <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p><b>ServerError:</b>Internal Server Error. <BR> <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    error:\"invalid_token\",\n    error_description:\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    error: 'Internal Error'\n    error_message: 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/:id/actions/enable",
    "title": "enable Application",
    "version": "1.0.0",
    "name": "EnableApplication",
    "group": "Application",
    "description": "<p>Accessible by access_token, It enable the Application. To call this endpoint must have an admin token.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access_token to access to this resource. it must be sended in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the Application id to identify the Application</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "201 - Created": [
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>contains the new Application status</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 201 CREATED",
          "content": " HTTP/1.1 201 CREATED\n\n{\n   \"status\":\"enabled\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/apps.js",
    "groupTitle": "Application",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> not authorized to call this endpoint.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create WeUiMS</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p><b>NotFound:</b> the Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifing the not Found Error.<BR> <b>request.body.erro_messager</b> contains an error message specifing the not Found Error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p><b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR> <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p><b>ServerError:</b>Internal Server Error. <BR> <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    error:\"invalid_token\",\n    error_description:\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    error: 'Internal Error'\n    error_message: 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/users/:id",
    "title": "Get the Application by id",
    "version": "1.0.0",
    "name": "GetApplication",
    "group": "Application",
    "description": "<p>Returns the info about Application. To call this endpoint must have an admin account or must be the Application itself.</p> ",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Application.id",
            "description": "<p>Application id identifier</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Application.field1",
            "description": "<p>field 1 defined in schema</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Application.field2",
            "description": "<p>field 2 defined in schema</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Application.fieldN",
            "description": "<p>field N defined in schema</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK, Success Response",
          "content": "\n{\n\n   \"id\": \"543fdd60579e1281b8f6da92\",\n   \"email\": \"prova@prova.it\",\n   \"name\": \"prova\",\n   \"notes\": \"Notes About prova\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/apps.js",
    "groupTitle": "Application",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> not authorized to call this endpoint.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create WeUiMS</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p><b>NotFound:</b> the Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifing the not Found Error.<BR> <b>request.body.erro_messager</b> contains an error message specifing the not Found Error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p><b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR> <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p><b>ServerError:</b>Internal Server Error. <BR> <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    error:\"invalid_token\",\n    error_description:\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    error: 'Internal Error'\n    error_message: 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/",
    "title": "Get all Applications",
    "version": "1.0.0",
    "name": "Get_Applications",
    "group": "Application",
    "description": "<p>Accessible by admin user access_token specified in config.js adminUser field. It returns the paginated list of all Applications. To set pagination skip and limit, you can do it in the URL request, for example &quot;get /apps?skip=10&amp;limit=50&quot;</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access_token to access to this resource. it must be sended in [ as query param || header]</p> "
          }
        ]
      }
    },
    "filename": "routes/apps.js",
    "groupTitle": "Application",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "_metadata",
            "description": "<p>object containing metadata for pagination information</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "_metadata.skip",
            "description": "<p>Skips the first skip results of this Query</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "_metadata.limit",
            "description": "<p>Limits the number of results to be returned by this Query.</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "_metadata.totalCount",
            "description": "<p>Total number of query results.</p> "
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "apps",
            "description": "<p>a paginated array list of users objects</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "apps.id",
            "description": "<p>User id identifier</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "apps.field1",
            "description": "<p>fiend 1 defined in schema</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "apps.field2",
            "description": "<p>fiend 2 defined in schema</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "apps.fieldN",
            "description": "<p>fiend N defined in schema</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK, Success Response",
          "content": "\n {\n   \"apps\":[\n                  {\n                      \"id\": \"543fdd60579e1281b8f6da92\",\n                      \"email\": \"prova@prova.it\",\n                      \"name\": \"prova\",\n                      \"notes\": \"Notes About prova\"\n                  },\n                  {\n                      \"id\": \"543fdd60579e1281sdaf6da92\",\n                      \"email\": \"prova1@prova.it\",\n                      \"name\": \"prova1\",\n                      \"notes\": \"Notes About prova1\"\n\n                 },\n                ...\n             ],\n\n   \"_metadata\":{\n               \"skip\":10,\n               \"limit\":50,\n               \"totalCount\":100\n           }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> not authorized to call this endpoint.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create WeUiMS</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p><b>NotFound:</b> the Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifing the not Found Error.<BR> <b>request.body.erro_messager</b> contains an error message specifing the not Found Error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p><b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR> <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p><b>ServerError:</b>Internal Server Error. <BR> <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    error:\"invalid_token\",\n    error_description:\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    error: 'Internal Error'\n    error_message: 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/signin",
    "title": "Application login",
    "version": "1.0.0",
    "name": "Login_Application",
    "group": "Application",
    "description": "<p>Accessible by access_token of type specified in config.js SignInAuthorizedAppAndMS field. It login Application and return the access_credentials.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access_token to access to this resource. it must be sended in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>the email</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>the password</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "HTTP/1.1 POST request\n Body:{ \"username\": \"prov@prova.it\" , \"password\":\"provami\"}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "201 - Created": [
          {
            "group": "201 - Created",
            "type": "Object",
            "optional": false,
            "field": "access_credentials",
            "description": "<p>contains information about access_credemtials.</p> "
          },
          {
            "group": "201 - Created",
            "type": "Object",
            "optional": false,
            "field": "access_credentials.apiKey",
            "description": "<p>contains information about apiKey</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "access_credentials.apiKey.token",
            "description": "<p>contains user Token</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "access_credentials.apiKey.expires",
            "description": "<p>contains information about token life</p> "
          },
          {
            "group": "201 - Created",
            "type": "Object",
            "optional": false,
            "field": "access_credentials.refreshToken",
            "description": "<p>contains information about refreshToken used to renew token</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "access_credentials.refreshToken.token",
            "description": "<p>contains user refreshToken</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "access_credentials.refreshToken.expires",
            "description": "<p>contains information about refreshToken life</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 201 CREATED",
          "content": " HTTP/1.1 201 CREATED\n\n{\n   \"access_credentials\":{\n            \"apiKey\":{\n                    \"token\":\"VppR5sHU_hV3U\",\n                    \"expires\":1466789299072\n             },\n             \"refreshToken\":{\n                     \"token\":\"eQO7de4AJe-syk\",\n                     \"expires\":1467394099074\n              }\n   }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/apps.js",
    "groupTitle": "Application",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> not authorized to call this endpoint.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create WeUiMS</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p><b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR> <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p><b>ServerError:</b>Internal Server Error. <BR> <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "403_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> username or password not valid.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>Not Logged ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>wrong username or password</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    error:\"invalid_token\",\n    error_description:\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    error: 'Internal Error'\n    error_message: 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 403 Unauthorized",
          "content": "HTTP/1.1 403 Unauthorized\n {\n    error:\"Unauthorized\",\n    error_description:\"Warning: wrong username\"\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/:id/actions/resetpassword",
    "title": "Reset Application password",
    "version": "1.0.0",
    "name": "ResetPassword",
    "group": "Application",
    "description": "<p>Accessible by admin or AuthApp access_token defined in config.js, It create a reset password Token.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access_token to access to this resource. it must be sended in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the Application id or username(email) the identify the Application</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "201 - Created": [
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "reset_token",
            "description": "<p>Contains grant token to set the new password</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 201 CREATED",
          "content": " HTTP/1.1 201 CREATED\n\n{\n   \"reset_token\":\"ffewfh5hfdfds7678d6fsdf7d6fsdfd86d8sf6\", *\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/apps.js",
    "groupTitle": "Application",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> not authorized to call this endpoint.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create WeUiMS</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p><b>NotFound:</b> the Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifing the not Found Error.<BR> <b>request.body.erro_messager</b> contains an error message specifing the not Found Error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p><b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR> <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p><b>ServerError:</b>Internal Server Error. <BR> <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    error:\"invalid_token\",\n    error_description:\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    error: 'Internal Error'\n    error_message: 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/:term/actions/email/find",
    "title": "Search all Application",
    "version": "1.0.0",
    "name": "SEARCH_Application",
    "group": "Application",
    "description": "<p>Accessible by admin user access_token specified in config.js adminUser field. It returns the paginated list of all Application that matching the search term to username. To set pagination skip and limit, you can do it in the URL request, for example &quot;get /apps?skip=10&amp;limit=50&quot;</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access_token to access to this resource. it must be sended in [ as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "skip",
            "description": "<p>start pagination</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "limit",
            "description": "<p>the number of elements</p> "
          }
        ]
      }
    },
    "filename": "routes/apps.js",
    "groupTitle": "Application",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "_metadata",
            "description": "<p>object containing metadata for pagination information</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "_metadata.skip",
            "description": "<p>Skips the first skip results of this Query</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "_metadata.limit",
            "description": "<p>Limits the number of results to be returned by this Query.</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "_metadata.totalCount",
            "description": "<p>Total number of query results.</p> "
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "apps",
            "description": "<p>a paginated array list of users objects</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "apps.id",
            "description": "<p>User id identifier</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "apps.field1",
            "description": "<p>fiend 1 defined in schema</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "apps.field2",
            "description": "<p>fiend 2 defined in schema</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "apps.fieldN",
            "description": "<p>fiend N defined in schema</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 200 OK, Success Response",
          "content": "\n {\n   \"apps\":[\n                  {\n                      \"id\": \"543fdd60579e1281b8f6da92\",\n                      \"email\": \"prova@prova.it\",\n                      \"name\": \"prova\",\n                      \"notes\": \"Notes About prova\"\n                  },\n                  {\n                      \"id\": \"543fdd60579e1281sdaf6da92\",\n                      \"email\": \"prova1@prova.it\",\n                      \"name\": \"prova1\",\n                      \"notes\": \"Notes About prova1\"\n\n                 },\n                ...\n             ],\n\n   \"_metadata\":{\n               \"skip\":10,\n               \"limit\":50,\n               \"totalCount\":100\n           }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> not authorized to call this endpoint.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create WeUiMS</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p><b>NotFound:</b> the Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifing the not Found Error.<BR> <b>request.body.erro_messager</b> contains an error message specifing the not Found Error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p><b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR> <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p><b>ServerError:</b>Internal Server Error. <BR> <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    error:\"invalid_token\",\n    error_description:\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    error: 'Internal Error'\n    error_message: 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/:id/actions/setpassword",
    "title": "Set new Application password",
    "version": "1.0.0",
    "name": "SetPassword",
    "group": "Application",
    "description": "<p>Accessible by access_token, It update Application password. To call this endpoint must have an admin token or must be the User itself or reset_token.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access_token to access to this resource. it must be sended in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the Application id or username(email) the identify the Application</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "201 - Created": [
          {
            "group": "201 - Created",
            "type": "Object",
            "optional": false,
            "field": "access_credentials",
            "description": "<p>contains information about access_credemtials.</p> "
          },
          {
            "group": "201 - Created",
            "type": "Object",
            "optional": false,
            "field": "access_credentials.apiKey",
            "description": "<p>contains information about apiKey</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "access_credentials.apiKey.token",
            "description": "<p>contains user Token</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "access_credentials.apiKey.expires",
            "description": "<p>contains information about token life</p> "
          },
          {
            "group": "201 - Created",
            "type": "Object",
            "optional": false,
            "field": "access_credentials.refreshToken",
            "description": "<p>contains information about refreshToken used to renew token</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "access_credentials.refreshToken.token",
            "description": "<p>contains user refreshToken</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "access_credentials.refreshToken.expires",
            "description": "<p>contains information about refreshToken life</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 201 CREATED",
          "content": " HTTP/1.1 201 CREATED\n\n{\n   \"access_credentials\":{\n            \"apiKey\":{\n                    \"token\":\"VppR5sHU_hV3U\",\n                    \"expires\":1466789299072\n             },\n             \"refreshToken\":{\n                     \"token\":\"eQO7de4AJe-syk\",\n                     \"expires\":1467394099074\n              }\n   }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/apps.js",
    "groupTitle": "Application",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> not authorized to call this endpoint.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create WeUiMS</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p><b>NotFound:</b> the Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifing the not Found Error.<BR> <b>request.body.erro_messager</b> contains an error message specifing the not Found Error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p><b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR> <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p><b>ServerError:</b>Internal Server Error. <BR> <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    error:\"invalid_token\",\n    error_description:\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    error: 'Internal Error'\n    error_message: 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/:id",
    "title": "Update Application",
    "version": "1.0.0",
    "name": "Update_Application",
    "group": "Application",
    "description": "<p>Accessible by access_token, It update Application object and return the updated resource. To call this endpoint must have an admin token or must be the Application itself.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access_token to access to this resource. it must be sended in [ body || as query param || header]</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "application",
            "description": "<p>the Application dictionary with all the fields to update, only email(username), password(there is a reset password endpoint and Application type can not be updated.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "HTTP/1.1 PUT request\n Body:{ \"name\":\"nome\", \"surname\":\"cognome\"}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "201 - Created": [
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "ApplicationField_1",
            "description": "<p>Contains field 1 updated and defined in Application Schema(example name)</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "ApplicationField_2",
            "description": "<p>Contains field 2 updated and defined in Application Schema(example notes)</p> "
          },
          {
            "group": "201 - Created",
            "type": "String",
            "optional": false,
            "field": "ApplicationField_N",
            "description": "<p>Contains field N updated and defined in Application Schema(example type)</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example: 201 CREATED",
          "content": " HTTP/1.1 201 CREATED\n\n{\n   \"name\":\"Micio\",\n   \"notes\":\"Macio\",\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/apps.js",
    "groupTitle": "Application",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401_Unauthorized",
            "description": "<p><strong>Unauthorized:</strong> not authorized to call this endpoint.<BR> <b>request.body.error</b> Error name specifing the problem as: <i>NotAuthorized ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>only admin user can create WeUiMS</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "404_NotFound",
            "description": "<p><b>NotFound:</b> the Object with specified <code>id</code> was not found.<BR> <b>request.body.error</b> contains an error name specifing the not Found Error.<BR> <b>request.body.erro_messager</b> contains an error message specifing the not Found Error.<BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p><b>BadRequest:</b> The server cannot or will not process the request due to something that is perceived to be a client error<BR> <b>request.body.error</b> Error name as: <i>BadRequest ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem as: <i>malformed request syntax, invalid reques, invalid fields ....</i><BR></p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500_ServerError",
            "description": "<p><b>ServerError:</b>Internal Server Error. <BR> <b>request.body.error</b> contains an error type message specifing the problem as: <i>Db Internal Microservice Error ....</i><BR> <b>request.body.error_message</b> Error Message specifing the problem  as: <i>Connection Down</i><BR></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: 401 Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n {\n    error:\"invalid_token\",\n    error_description:\"Unauthorized: The access token expired\"\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 400 BadRequest",
          "content": "HTTP/1.1 400 InvalidRequest\n {\n    error:'BadRequest',\n    error_message:'no body sended',\n }",
          "type": "json"
        },
        {
          "title": "Error-Response: 500 Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n {\n    error: 'Internal Error'\n    error_message: 'something blew up, ERROR: No MongoDb Connection'\n }",
          "type": "json"
        }
      ]
    }
  }
] });