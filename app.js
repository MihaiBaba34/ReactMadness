
var http = require('http');

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

var portid = 7000; // HTTP listening port number
var sess;

//react native code generator
var reactNativeGenerator = require("./ReactNativeGenerator");



app.use(express.static(rootDir));
app.use(session({
    secret: 'ssshhhhh',
    saveUninitialized: false,
    resave: false
}));

app.use(bodyParser.urlencoded({
    extended: false
}));



app.listen(portid, function () {
    console.log("Server running at http://localhost:" + portid);

    var button = "button";
    //var returnedVariable = reactNativeGenerator.generate(button);
    reactNativeGenerator.main();
    
});






//MODIFIED
app.post('/login', function (request, response) {

    validateUser(request, response);

});

app.post('/register', function (request, response) {

    registerUser(request, response);

});

app.get('/projects', function (request, response) {

    getProjects(request, response);

});

app.post('/createProject', function (request, response) {

    createProject(request, response);

});

app.delete('/deleteProject', function (request, response) {

    deleteProject(request, response);

});

app.get('/viewProject', function (request, response) {

    viewProject(request, response);

});

app.post('/modifyProjectName', function (request, response) {

    modifyProjectName(request, response);

});

app.post('/createControl', function (request, response) {

    createControl(request, response);

});








//MODIFIED
function createControl(request, response) {
    
    var proj_id = request.body.project_id;
    var page_id = request.body.page_id;
    var position = request.body.position;
    var control_type = request.body.control_type;

    pool.getConnection(function (err, connection) {

        if (err) {
            response.json({ code: 100, status: "Error in connection database" });
            return;
        }

        query = "insert into controls(position, page_id, control_type_id) "+
        "values(\"" + position + "\",\"" + page_id + "\",\"" + control_type + "\")";

        connection.query(query, function (err, rows) {
            connection.release();
            if (!err) {
                response.json({ code: 200, status: "Success", control_id: rows.insertId });
            }
            else {
                response.json({ code: 101, status: "Error" });
            }
        });

        connection.on('error', function (err) {
            response.json({ code: 100, status: "Error in connection database" });
            return;
        });
    });
}

function modifyProjectName(request, response) {
    
    var prj_id = request.body.project_id;
    var new_project_name = request.body.project_name;

    pool.getConnection(function (err, connection) {

        if (err) {
            response.json({ code: 100, status: "Error in connection database" });
            return;
        }

        query = "update projects set name=\""+new_project_name+"\"  where id = \"" + prj_id + "\"";
        connection.query(query, function (err, rows) {
            connection.release();
            if (!err) {
                response.json({ code: 200, status: "Success" });
            }
            else {
                response.json({ code: 101, status: "Error" });
            }

        });

        connection.on('error', function (err) {
            response.json({ code: 100, status: "Error in connection database" });
            return;
        });
    });
}


function viewProject(request, response) {

    var prj_id = request.body.project_id;

    pool.getConnection(function (err, connection) {

        if (err) {
            response.json({ code: 100, status: "Error in connection database" });
            return;
        }

        query = "select prj.name as project_name, pag.name as page_name, c.position, c.name as control_position from " + 
        "projects prj join pages pag on prj.id = pag.project_id join controls c on pag.id = c.page_id where proj.id=\""+prj_id+"\")";
        connection.query(query, function (err, rows) {
            connection.release();
            if (!err) {

                if (rows.length > 0) {

                    response.json({ code: 200, status: "Success", project: rows });
                }
                else {
                    response.json({ code: 101, status: "Error" });
                }
            }

        });

        connection.on('error', function (err) {
            response.json({ code: 100, status: "Error in connection database" });
            return;
        });
    });
}




function deleteProject(request, response) {
    
    var prj_id = request.body.project_id;

    pool.getConnection(function (err, connection) {

        if (err) {
            response.json({ code: 100, status: "Error in connection database" });
            return;
        }

        query = "delete from projects where id = \"" + prj_id + "\"";
        connection.query(query, function (err, rows) {
            connection.release();
            if (!err) {
                response.json({ code: 200, status: "Success" });
            }
            else {
                response.json({ code: 101, status: "Error" });
            }

        });

        connection.on('error', function (err) {
            response.json({ code: 100, status: "Error in connection database" });
            return;
        });
    });
}


function createProject(request, response) {
    var token = request.body.token;
    var prj_name = request.body.project_name;

    pool.getConnection(function (err, connection) {

        if (err) {
            response.json({ code: 100, status: "Error in connection database" });
            return;
        }

        query = "insert into projects(name, owner_id) values(\"" + prj_name + "\",\"" + token + "\" )";
        connection.query(query, function (err, rows) {
            connection.release();
            if (!err) {
                response.json({ code: 200, status: "Success", project_id: rows.insertId });
            }
            else {
                response.json({ code: 101, status: "Error" });
            }

        });

        connection.on('error', function (err) {
            response.json({ code: 100, status: "Error in connection database" });
            return;
        });
    });
}


function getProjects(request, response) {

    var token = request.body.token;

    pool.getConnection(function (err, connection) {

        if (err) {
            response.json({ code: 100, status: "Error in connection database" });
            return;
        }

        query = "select id, name from projects where owner_id=(select id from users where username=\"" + token + "\")";
        connection.query(query, function (err, rows) {
            connection.release();
            if (!err) {

                if (rows.length > 0) {

                    response.json({ code: 200, status: "Success", projectsIDs: rows });
                }
                else {
                    response.json({ code: 101, status: "Error" });
                }
            }

        });


        connection.on('error', function (err) {
            response.json({ code: 100, status: "Error in connection database" });
            return;
        });
    });
}



function registerUser(request, response) {

    var username = request.body.username;
    var password = request.body.password;

    pool.getConnection(function (err, connection) {

        if (err) {
            response.json({ code: 100, status: "Error in connection database" });
            return;
        }

        query = "insert into users(username,password,types_of_users_id) values(\"" + username + "\",\"" + password + "\",1)";

        connection.query(query, function (err, rows) {
            connection.release();
            if (!err) {
                response.json({ code: 200, status: "Success", token: rows.insertId });
            }
            else {
                response.json({ code: 101, status: "Error" });
            }
        });

        connection.on('error', function (err) {
            response.json({ code: 100, status: "Error in connection database" });
            return;
        });
    });
}


function validateUser(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    console.log(username);
    console.log(password);
    pool.getConnection(function (err, connection) {

        if (err) {
            response.json({ code: 100, status: "Error in connection database" });
            return;
        }

        query = "select id as token from users where username=\"" +
            username + "\" and password=\"" + password + "\"";

        connection.query(query, function (err, rows) {
            connection.release();
            if (!err) {
                if (rows.length > 0) {
                    response.json({ code: 200, status: "Success", response: rows[0].token });
                }
                else {
                    response.json({ "code": 100, "status": "Error at database" });
                }
            }
        });

        connection.on('error', function (err) {
            response.json({ "code": 100, "status": "Error in connection database" });
            return;
        });
    });

}
