/* Copyright (c) 2015, Oracle and/or its affiliates. All rights reserved. */
/******************************************************************************
 *
 * You may not use the identified files except in compliance with the Apache
 * License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * NAME
 *   webapp.js
 *
 * DESCRIPTION
 *   Shows a web based query using connections from connection pool.
 *
 *   This displays a table of employees in the specified department.
 *
 *   The script creates an HTTP server listening on port 7000 and
 *   accepts a URL parameter for the department ID, for example:
 *   http://localhost:7000/90
 *
 *   Uses Oracle's sample HR schema.  Scripts to create the HR schema
 *   can be found at: https://github.com/oracle/db-sample-schemas
 *
 *****************************************************************************/
var http = require('http');
//var oracledb = require('oracledb');
//var dbConfig = require('./dbconfig.js');

var fs = require('fs');
var url = require('url');
var path = require('path');
var rootDir = __dirname + '/public';

'use strict';

var express = require('express');
var session = require('express-session');
var app = express();

var bodyParser = require('body-parser')
var crypto = require('crypto');

var async = require('async');
var cheerio = require('cheerio');

var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 100, //important
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'react_madness'
});


app.use(express.static(rootDir));
app.use(session({
    secret: 'ssshhhhh',
    saveUninitialized: false,
    resave: false
}));

app.use(bodyParser.urlencoded({
    extended: false
}));



var portid = 7000; // HTTP listening port number
var sess;


//MODIFIED
app.get('/logout', function (request, response) {
    request.session.destroy(function (err) {
        if (err) {
            console.log(err);
        }
        else {
            sess = null;
            response.sendFile(rootDir + '/index.html');
        }
    });
});

//insert a user through a form
app.post('/registerUser', function (request, response) {

    //insertUserIntoDB(pool, request, response);
    registerUser(request, response);

});

//insert an admin through a form
app.post('/registerAdmin', function (request, response) {

    //insertAdminIntoDB(pool, request, response);

});

//authenticate a user through a form
app.post('/loginUser', function (request, response) {

    validateUser(request, response);

});

//authenticate an admin through a form
app.post('/loginAdmin', function (request, response) {

    //validateAdmin(pool, request, response);

});

app.get("/workspace", function (request, response) {

    console.log('workspace');

    if (sess) {
        if (sess.username) {
            fs.readFile(rootDir + '/workspace.html', function (err, data) {

                var $ = cheerio.load(data);

                $('#idWelcome').append('Welcome ' + sess.username);

                response.send($.html());
            });

            //response.sendFile(rootDir + '/VreiSaFiiMilionarGame.html');                    
        } else {
            response.write('<h1>Please login first</h1>');
            response.end();
        }

    } else {
        response.write('<h1>Please login first</h1>');
        response.end();
    }



});



app.get("/VreiSaFiiMilionarGame", function (request, response) {

    console.log('VreiSaFiiMilionarGame');

    if (sess) {
        if (sess.username) {
            fs.readFile(rootDir + '/VreiSaFiiMilionarGame.html', function (err, data) {

                var $ = cheerio.load(data);

                $('#idWelcome').append('Welcome ' + sess.username);

                response.send($.html());
            });

            //response.sendFile(rootDir + '/VreiSaFiiMilionarGame.html');                    
        } else {
            response.write('<h1>Please login first</h1>');
            response.end();
        }

    } else {
        response.write('<h1>Please login first</h1>');
        response.end();
    }

});

app.get("/administratorPage", function (request, response) {

    console.log('administratorPage');

    if (sess) {
        if (sess.username && sess.admin === true) {
            fs.readFile(rootDir + '/administratorPage.html', function (err, data) {

                var $ = cheerio.load(data);

                $('#idWelcome').append('Welcome ' + sess.username);

                response.send($.html());
            });

            //response.sendFile(rootDir + '/VreiSaFiiMilionarGame.html');                    
        } else {
            response.write('<h1>Please login first</h1>');
            response.end();
        }

    } else {
        response.write('<h1>Please login first</h1>');
        response.end();
    }


});


app.get("/adaugaIntrebare", function (request, response) {

    console.log('adaugaIntrebare');

    if (sess) {
        if (sess.username && sess.admin === true) {
            fs.readFile(rootDir + '/adaugaIntrebare.html', function (err, data) {

                var $ = cheerio.load(data);

                $('#idWelcome').append('Welcome ' + sess.username);

                response.send($.html());
            });

            //response.sendFile(rootDir + '/VreiSaFiiMilionarGame.html');                    
        } else {
            response.write('<h1>Please login first</h1>');
            response.end();
        }

    } else {
        response.write('<h1>Please login first</h1>');
        response.end();
    }


});


app.get("/adaugaAdministrator", function (request, response) {

    console.log('adaugaAdministrator');

    if (sess) {
        if (sess.username && sess.admin === true) {
            fs.readFile(rootDir + '/adaugaAdministrator.html', function (err, data) {

                var $ = cheerio.load(data);

                $('#idWelcome').append('Welcome ' + sess.username);

                response.send($.html());
            });

            //response.sendFile(rootDir + '/VreiSaFiiMilionarGame.html');                    
        } else {
            response.write('<h1>Please login first</h1>');
            response.end();
        }

    } else {
        response.write('<h1>Please login first</h1>');
        response.end();
    }


});


app.listen(portid, function () {
    console.log("Server running at http://localhost:" + portid);
});
//MODIFIED


function registerUser(request, response) {

    var username = request.body.username;
    var password = request.body.password;

    pool.getConnection(function (err, connection) {

        if (err) {
            response.json({ "code": 100, "status": "Error in connection database" });
            return;
        }

        query = "insert into users(username,password,types_of_users_id) values(\""+username+"\",\""+password+"\",1)";


        connection.query(query, function (err, rows) {
            connection.release();
            if (!err) {

                response.json("success");
                
            }
            
        });

        connection.on('error', function (err) {
            response.json({ "code": 100, "status": "Error in connection database" });
            return;
        });

    });

}


function validateUser(request, response) {
    var username = request.body.username;
    var password = request.body.password;

    pool.getConnection(function (err, connection) {

        if (err) {
            response.json({ "code": 100, "status": "Error in connection database" });
            return;
        }

        query = "select count(*) as cnt from users where username=\"" +
            username + "\" and password=\"" + password + "\"";

        connection.query(query, function (err, rows) {
            connection.release();
            if (!err) {

                //TODO: encapsulate response in a message object
                //TODO: encryption!!
                if (rows[0].cnt > 0) {
                    
                    sess = request.session;
                    sess.username = request.body.username;
                    sess.admin = false;


                    response.json("success");

                }
                else {
                    response.json("Failed");
                }
            }

        });

        connection.on('error', function (err) {
            response.json({ "code": 100, "status": "Error in connection database" });
            return;
        });

    });

}




// Report an error
function handleError(response, text, err) {
    if (err) {
        text += err.message;
    }
    console.error(text);
    response.write("<p>Error: " + text + "</p>");
    htmlFooter(response);
}