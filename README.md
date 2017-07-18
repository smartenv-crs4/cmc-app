#CMC App Microservice
CMC App is the third-party app integration microservice of the CMC (Crs4 Microservice Core) framework.
It takes care of the integration of third-party applications to the CMC framework. <br>
For API reference, see the service auto-generated online documentation at <code>http://service_base_url/doc</code>.

##Usage

###Install

####1) Install Mocha (for testing):

    sudo npm install -g mocha

####2) Install apiDoc (for API documentation):

    sudo npm install -g apidoc

####3) Install all dependencies
    
    npm install


###Run test suite

    npm test
    

###Generate API documentation

    apidoc -i ./routes -o apidoc
    

###Run the application

####For *development* mode, run:

    NODE_ENV=dev npm start

####For *production* mode, run:

    npm start
