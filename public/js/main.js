var baseServerUrl = "http://localhost:7000";
var baseServiceUrl = "http://localhost:8000";
var userId;

$(document).ready(function () {
    $("#formInregistrareUser").submit(function (e) {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        var url = baseServiceUrl + "/register";
        var username = $("#formInregistrareUser").find('input[name="username"]').val();
        var password = $("#formInregistrareUser").find('input[name="password"]').val();
        if (username === "" || password === "") {
            alert("Username or password should not be empty!");
        }
        else {
            console.log(username + " -> " + password);
            $.ajax({
                type: "POST",
                url: url,
                data: $("#formInregistrareUser").serialize(), // serializes the form's elements.
                success: function (obj) {
                    console.log(obj);
                    //TODO: process received response message
                    if (obj.status === "Success") {
                        window.location.href = "/index.html";
                    }
                }
            });
        }
    });

    $("#formInregistrareAdmin").submit(function (e) {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        var url = "/registerAdmin";
        $.ajax({
            type: "POST",
            url: url,
            data: $("#formInregistrareAdmin").serialize(), // serializes the form's elements.
            success: function (data) {
                alert(data); // show response from the php script.
            }
        });
    });

    $("#formLoginAdministrator").submit(function (e) {

        e.preventDefault(); // avoid to execute the actual submit of the form.

        var url = "http://localhost:7000/loginAdmin";

        $.ajax({
            type: "POST",
            url: url,
            data: $("#formLoginAdministrator").serialize(), // serializes the form's elements.
            success: function (data) {
                if (data.isValid === 1) {
                    window.location.href = "/administratorPage";
                }
                else {
                    alert("Nume admin sau parola incorecte!");
                }
            }
        });
    });

    $("#formLoginUser").submit(function (e) {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        var username = $("#formLoginUser").find('input[name="username"]').val();
        var password = $("#formLoginUser").find('input[name="password"]').val();
        console.log(username + " -> " + password);
        if (username == "" || password == "") {
            $(".error")[0].innerHTML = "Username or password should not be empty!";
        }
        else {
            $.ajax({
                type: "POST",
                url: baseServiceUrl + "/login",
                data: $("#formLoginUser").serialize(), // serializes the form's elements.
                success: function (data) {                    
                    console.log("Callback Login:");
                    console.log(data); 
                    userId = data.userId;
                    getProjects();
                },
                error: function(jqXHR, exception) {
                    if (jqXHR.status === 0) {
                        $(".error")[0].innerHTML = 'Could not connect.\n Verify Network.';
                    } else if (jqXHR.status == 404) {
                        $(".error")[0].innerHTML = 'The username or password is wrong. Please try again.';
                    } else if (jqXHR.status == 500) {
                        $(".error")[0].innerHTML = 'Service had an internal error during login.';
                    } else if (exception === 'parsererror') {
                        $(".error")[0].innerHTML = 'Error while processing JSON response';
                    } else if (exception === 'timeout') {
                        $(".error")[0].innerHTML = 'The server did not respond in the given timeout.';
                    } else if (exception === 'abort') {
                        $(".error")[0].innerHTML = 'Error! Aborting Login process...';
                    } else {
                        alert('Uncaught Error.\n' + jqXHR.responseText);
                    }
                }
            });
        }
    });
});

function getProjects(){
    $.ajax({
        type: "GET",
        url: baseServiceUrl + "\\projects\\" + userId,
        success: function (data) {
            var body = WrapProjects(data.projects);
            $('body')[0].innerHTML = body;
        },
        error: function(jqXHR, exception) {
            if (jqXHR.status === 0) {
                $(".error")[0].innerHTML = 'Could not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                $(".error")[0].innerHTML = 'The username or password is wrong. Please try again.';
            } else if (jqXHR.status == 500) {
                $(".error")[0].innerHTML = 'Service had an internal error during login.';
            } else if (exception === 'parsererror') {
                $(".error")[0].innerHTML = 'Error while processing JSON response';
            } else if (exception === 'timeout') {
                $(".error")[0].innerHTML = 'The server did not respond in the given timeout.';
            } else if (exception === 'abort') {
                $(".error")[0].innerHTML = 'Error! Aborting Login process...';
            } else {
                alert('Uncaught Error.\n' + jqXHR.responseText);
            }
        }
    });
}

function WrapProjects(projects){
    var body = "<div class=\"table-title\">";
    body += "<h3>My projects</h3>";
    body += "</div>";
    body += "<table class=\"table-fill\">";
    body += "<thead>";
    body += "<tr>";
    body += "<th class=\"text-left\">Project Id</th>";
    body += "<th class=\"text-left\">Project Name</th>";
    body += "</tr>";
    body += "</thead>";
    body += "<tbody class=\"table-hover\">";   
    for(project in projects){
        body += "<tr>";

        body += "<td class=\"text-left\">";
        body += project.id;        
        body += "</td>";
        body += "<td class=\"text-left\">";
        body += project.name;        
        body += "</td>";

        body += "</tr>";
    }
    body += "</tbody>";
    body += "</table></br>";
    body += "<button class=\"table-title\" onClick=\"createProject()\">Create Project</button>";

    return body;
}

function createProject(){
    console.log(userId);
    $.ajax({
        type: "POST",
        url: baseServiceUrl + "/projects/" + userId,
        data: { projectName : "HelloWorld" },
        success: function (data) {
            console.log("Create project callback:");
            console.log(data);
            if (data.insertedId > 0) {                
                getProjects();
            }
            else {
                alert("Error while creating project");
            }
        }
    });
}