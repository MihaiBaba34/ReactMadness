
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
<<<<<<< HEAD
    console.log("Server running at http://localhost:" + portid);   
=======
    console.log("Server running at http://localhost:" + portid);

    reactNativeGenerator.initProject("secondsecondProject");    
>>>>>>> ccb003ebb48937171ef79d37ad16155a8640418b
});


//MODIFIED
app.post('/login', function (request, response) {

    validateUser(request, response);

});
// will be used to get  used by it's id
app.get('/user/:userId', function (request, response) {

    getUser(request, response);

});
// handles the register form and creates a new user
app.post('/user', function (request, response) {

    registerUser(request, response);

});
// handles the edit form and updates a certain user intentified by id, if it doesn't exist create one
app.put('/user/:userId', function (request, response) {

    updateUser(request, response);

});
// deletes a existing user
app.delete('/user/:userId', function (request, response) {

    deleteUser(request, response);

});
// returns a list of all the projects of the user identified by id
app.get('/projects/:userId', function (request, response) {

    getProjects(request, response);

});
// adds a new project to the curent list of projects of the user identified by id
app.post('/projects/:userId', function (request, response) {

    createProject(request, response);

});
// get a project identified by id
app.get('/project/:projectId', function (request, response) {

    getProject(request, response);

});
// update a project identified by id, if it doesn't exist create one
app.put('/project/:projectId', function (request, response) {

    updateProject(request, response);

});
// delete a project intentified by project id
app.delete('/project/:projectId', function (request, response) {

    deleteProject(request, response);

});
// create a new control
app.post('/control', function (request, response) {

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

function getProjects(request, response) {

    var userId = request.params.userId;

    console.log("getoricegst" + userId) ;

    pool.getConnection(function (err, connection) {

        if (err) {
            response.json({ code: 100, status: "Error while connecting to the database." });
            return;
        }

        query = "SELECT id, name FROM projects WHERE owner_id=\"" + userId + "\"";
        connection.query(query, function (err, rows) {
            connection.release();
            if (!err) {
                response.json({ code: 200, status: "Success", projects: rows });
            }

        });

        connection.on('error', function (err) {
            response.json({ code: 100, status: "Error while connecting to the database." });
            return;
        });
    });
}

function createProject(request, response) {
    var userId = request.params.userId;
    var projectName = request.body.projectName;
    console.log(userId + "  " + projectName);
    pool.getConnection(function (err, connection) {

        if (err) {
            response.json({ code: 100, status: "EError while connecting to the database." });
            return;
        }

        query = "INSERT INTO projects(name, owner_id) VALUES(\"" + projectName + "\",\"" + userId + "\" )";
        connection.query(query, function (err, rows) {
            connection.release();
            if (!err) {
                response.json({ code: 200, status: "Success" });

                //in case of success initiate an empty project with the given name
                

            }
            else {
                response.json({ code: 101, status: "Error" });
            }

        });

        connection.on('error', function (err) {
            response.json({ code: 100, status: "Error while connecting to the database." });
            return;
        });
    });
}

function getProject(request, response) {

    var projectId = request.params.projectId;

    pool.getConnection(function (err, connection) {

        if (err) {
            response.json({ code: 100, status: "Error while connecting to the database." });
            return;
        }

        query = "SELECT prj.name AS project_name, pag.name as page_name, c.position, c.name AS control_position FROM " + 
        "projects prj JOIN pages pag ON prj.id = pag.project_id JOIN controls c ON pag.id = c.page_id WHERE proj.id=\""+projectId+"\")";
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
        response.json({ code: 100, status: "Error while connecting to the database." });
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


    console.log("sdfsfsf");
    pool.getConnection(function (err, connection) {

        if (err) {
            response.json({ code: 100, status: "Error in connection database" });
            return;
        }

        query = "select id from users where username=\"" +
        username + "\" and password=\"" + password + "\"";

        connection.query(query, function (err, rows) {
            connection.release();
            if (!err) {
                if (rows.length > 0) {
                    response.json({ code: 200, status: "Success", userId: rows[0].id });

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
