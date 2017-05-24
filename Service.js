'use strict';
var http = require('http');
var https = require('https');
var fs = require('fs');
var url = require('url');
var path = require('path');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser')
var crypto = require('crypto');
var async = require('async');
var cheerio = require('cheerio');
var mysql = require('mysql');
var cors = require('cors');
//react native code generator
var reactNativeGenerator = require("./ReactNativeGenerator");

var pool = mysql.createPool({
    connectionLimit: 100, //important
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'react_madness'
});

var options = {
  cert: fs.readFileSync('security/30423947.cert'),
  key: fs.readFileSync('security/30423947.key')
};
var rootDir = __dirname + '/projects_path';
var portid = 8443; // HTTPS listening port number
var sess;

var app = express();
var httpsServer = https.createServer(options, app);

app.use(cors());
app.use(session({
    secret: 'ssshhhhh',
    saveUninitialized: false,
    resave: false
}));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static(rootDir));

httpsServer.listen(portid, function () {
    console.log("Server running at https://localhost:" + portid); 
});

/**************URL's and what they do******************/
// handles the validation process foar an existing user
app.post('/login', function (request, response) {
    validateUser(request, response);
});

// handles the get user by it's id process
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
// download a project identified by id
app.get('/download/:projectId', function (request, response) {
    downloadProject(request, response);
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
/**************URL's and what they do******************/

/**************Actual functions implementations******************/
function validateUser(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    console.log("Login user: " + username + " -> " + password);
    pool.getConnection(function (err, connection) {
        if (err) {
            response.json({ code: 100, status: "Error in connection database" });
            return;
        }
        var query = "SELECT id FROM users WHERE username=\"" + username + "\" AND password=\"" + password + "\"";
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

function getUser(request, response) {
    var userId = request.params.userId;
    console.log("Get user with id " + userId);
    pool.getConnection(function (err, connection) {
        if (err) {
            response.json({ code: 100, status: "Error in connection database" });
            return;
        }
        var query = "SELECT username, usertype, password FROM users " + 
        "INNERJOIN types_of_users ON types_of_users_id = types_of_users.id WHERE users.id= " + userId;
        connection.query(query, function (err, rows) {
            connection.release();
            if (!err) {
                if (rows.length > 0) {
                	var passStar = "";
                	for (var i = 0; i < rows[0].password.length; i++) {
                		passStar += "*";
                	};
                    response.json({ 
                    	code: 200,
                    	status: "Success",
                    	username: rows[0].username,
                    	usertype: rows[0].usertype,
                    	password : passStar 
                    });
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

function registerUser(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    console.log("Register user: " + username + " -> " + password);
    pool.getConnection(function (err, connection) {
        if (err) {
            response.json({ code: 100, status: "Error in connection database" });
            return;
        }
        var query = "INSERT INTO users(username,password,types_of_users_id) VALUES(\"" + username + "\",\"" + password + "\",1)";
        connection.query(query, function (err, rows) {
            connection.release();
            if (!err) {
                response.json({ code: 200, status: "Success", userId: rows.insertId });
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

function updateUser(request, response) {
    var userId = request.params.userId;
    var username = request.body.username;
    var password = request.body.password;
    console.log("Update user with id " + userId + " to: " + username + " -> " + password);
    pool.getConnection(function (err, connection) {
        if (err) {
            response.json({ code: 100, status: "Error in connection database" });
            return;
        }
        var query = "SELECT username FROM users WHERE id = " + userId;
        connection.query(query, function (err, rows) {
            connection.release();
            if (!err) {
                if (rows.length > 0) {
	            	// It exists, update it
	            	var query = "UPDATE users SET username = " + username + 
	            	" AND password = " + password + "WHERE id = " + userId;
	            	connection.query(query, function (err, rows) {
			            connection.release();
			            if (!err) {
	                		response.json({ code: 200, status: "Success", userId: rows.insertId });
			            }
			        });
                }else{
	            	// It doesn't exist, create it
	        		var query = "INSERT INTO users(username,password,types_of_users_id)" +
	        		" VALUES(\"" + username + "\",\"" + password + "\", 1)";
	        		connection.query(query, function (err, rows) {
			            connection.release();
			            if (!err) {
	                		response.json({ code: 200, status: "Success", userId: 0 }); 
			            }
			        });               	
                }
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

function deleteUser(request, response) {
    var userId = request.params.userId;
    console.log("Delete user with id " + userId);
    pool.getConnection(function (err, connection) {
        if (err) {
            response.json({ code: 100, status: "Error in connection database" });
            return;
        }
        var query = "DELETE FROM users WHERE id = " + userId;
        connection.query(query, function (err, rows) {
            connection.release();
            if (!err) {              	
                response.json({ code: 200, status: "Success"});
            }
            else {
                response.json({ code: 101, status: "Error" });
            }
        });

        connection.on('error', function (err) {
            response.json({ "code": 100, "status": "Error in connection database" });
            return;
        });
    });
}

function getProjects(request, response) {
    var userId = request.params.userId;
    console.log("Get projects for user with id: " + userId) ;
    pool.getConnection(function (err, connection) {
        if (err) {
            response.json({ code: 100, status: "Error while connecting to the database." });
            return;
        }
        var query = "SELECT id, name FROM projects WHERE owner_id=\"" + userId + "\"";
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
    console.log("Create project named " + projectName + " for user with id " + userId);
    pool.getConnection(function (err, connection) {
        if (err) {
            response.json({ code: 100, status: "Error while connecting to the database." });
            return;
        }
        var query = "INSERT INTO projects(name, creation_date, owner_id) VALUES(\"" + projectName + "\",\'" + new Date().toISOString().slice(0, 19).replace('T', ' ') + "\', \"" + userId + "\" )";
        connection.query(query, function (err, rows) {
            connection.release();
            if (!err) {
                response.json({ code: 200, status: "Success", projectId: rows.insertId });
                //in case of success initiate an empty project with the given name
                reactNativeGenerator.initProject(projectName);
            }
            else {
            	console.log(err);
                response.json({ code: 101, status: "Error" });
            }
        });

        connection.on('error', function (err) {
            response.json({ code: 100, status: "Error while connecting to the database." });
            return;
        });
    });
}

function downloadProject(request,response)
{
    var projectId = request.params.projectId;
    console.log("Download project with id " + projectId);
    pool.getConnection(function (err, connection) {
        if (err) {
            response.json({ code: 100, status: "Error while connecting to the database." });
            return;
        }
        var query = "SELECT name FROM projects WHERE id = " + projectId;
	    connection.query(query, function (err, projects) {
	        connection.release();
	        if (!err) {
	            if (projects.length > 0) {

                    console.log("assembleRelease with name: " + projects[0].name);
                    reactNativeGenerator.build(projects[0].name);
	                
                     response.json({ 
	                	code: 200, 
	                	status: "Success"
	                });
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

function getProject(request, response) {
    var projectId = request.params.projectId;
    console.log("Get project with id " + projectId);
    pool.getConnection(function (err, connection) {
        if (err) {
            response.json({ code: 100, status: "Error while connecting to the database." });
            return;
        }
        var query = "SELECT name, creation_date, username AS owner FROM projects WHERE id = " + projectId;
	    connection.query(query, function (err, projects) {
	        connection.release();
	        if (!err) {
	            if (projects.length > 0) {	            	     
	                response.json({ 
	                	code: 200, 
	                	status: "Success", 
	                	name: rows[0].name, 
	                	creation_date: rows[0].creation_date,
	                	owner: owner,
	                	pages: JSON.stringify(getPagesForProject(projectId))
	                });
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

function getPagesForProject(projectId){
	var query = "SELECT id, name FROM pages WHERE projectId = " + projectId;
	connection.query(query, function (err, pages) {
        connection.release();
        if (!err) {
        	if(pages.length > 0)
        	{
        		for (var i = 0; i < pages.length; i++) {
        			pages[i].set('controls', getControlsForPage(pages[i].id));        			  
        		};
        		return pages;
        	}
        }
    });

    return null;
}

function getControlsForPage(pageId){
	var query = "SELECT position, name, type_of_controls.name AS type_of_control " + 
	"FROM controls INNERJOIN type_of_controls ON type_of_controls_id = type_of_controls.id " + 
	"WHERE page_id = " + pages[i].id;
	connection.query(query, function (err, rows) {
	    connection.release();
	    if (!err) {
	    	return rows;
	    }
	});

	return null; 
}

function deleteProject(request, response) {
    var prj_id = request.params.projectId;
    console.log("Delete project with id " + prj_id);
    pool.getConnection(function (err, connection) {
        if (err) {
            response.json({ code: 100, status: "Error in connection database" });
            return;
        }
        var query = "DELETE FROM projects WHERE id = \"" + prj_id + "\"";
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

function createControl(request, response) {
    var proj_id = request.body.projectId;
    var buttonName = request.body.buttonName;
    var projectName = "myAwesomeProject";

    var page_id = request.body.page_id;
    var position = request.body.position;
    var control_type = request.body.control_type;
    
    console.log("request.body");
    console.log(request.body);
    console.log("request.body");
    
    reactNativeGenerator.generate(projectName, buttonName);


    // pool.getConnection(function (err, connection) {
    //     if (err) {
    //         response.json({ code: 100, status: "Error in connection database" });
    //         return;
    //     }

    //     query = "INSERT INTO controls(position, page_id, control_type_id) "+
    //     "VALUES(\"" + position + "\",\"" + page_id + "\",\"" + control_type + "\")";

    //     connection.query(query, function (err, rows) {
    //         connection.release();
    //         if (!err) {
    //             response.json({ code: 200, status: "Success", control_id: rows.insertId });
    //         }
    //         else {
    //             response.json({ code: 101, status: "Error" });
    //         }
    //     });

    //     connection.on('error', function (err) {
    //         response.json({ code: 100, status: "Error in connection database" });
    //         return;
    //     });
    // });
}
