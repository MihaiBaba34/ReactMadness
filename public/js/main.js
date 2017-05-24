var baseServerUrl = "http://localhost:8080";
var baseServiceUrl = "https://localhost:8443";
var userId;

$(document).ready(function () {
    $("#formInregistrareUser").submit(function (e) {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        var url = baseServiceUrl + "/user";
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

                    console.log("SUCCESS REGISTERING USER");
                    console.log("OBJ");
                    console.log(obj);
                    console.log("OBJ");

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

                    // Store
                    localStorage.setItem("userID", userId);
                    localStorage.setItem("username", username);

                    window.location.href = baseServerUrl + "/projects.html";
                },
                error: function (jqXHR, exception) {
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

function getProjects() {


    //alert("getProjects was called");
    var userId = localStorage.getItem("userID");

    $.ajax({
        type: "GET",
        url: baseServiceUrl + "/projects/" + userId,
        success: function (data) {


            console.log("data received from projects:")
            console.log(data);
            console.log("data received from projects:")
            //TODO

            populateProjectsTable(data.projects);


            // var body = WrapProjects(data.projects);
            // $('body')[0].innerHTML = body;

        },
        error: function (jqXHR, exception) {
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

function openModal(currentTrObject) {
    console.log(currentTrObject);
    var selected_project_id = currentTrObject.getElementsByTagName("td")[0].innerHTML;
    var selected_project_name = currentTrObject.getElementsByTagName("td")[1].innerHTML;

    $('#project_modal').modal('toggle');
    localStorage.setItem("selected_project_id", selected_project_id);
    localStorage.setItem("selected_project_name", selected_project_name);
}

function deleteProject() {
    console.log("deleteProject");

    console.log(localStorage.getItem("selected_project_id"));
    console.log(localStorage.getItem("selected_project_name"));

    //alert("getProjects was called");
    var project_id = localStorage.getItem("selected_project_id");

    $.ajax({
        type: "DELETE",
        url: baseServiceUrl + "/project/" + project_id,
        success: function (data) {

            if (data.status === "Success") {

                console.log("data received from delete project:")
                console.log(data);
                console.log("data received from delete project:")

                window.location.reload();

            }
        },

    });


    $('#project_modal').modal('hide');

}

function addButton() {

    var buttonName = document.getElementById("inputButtonNameID").value;
    var project_id = localStorage.getItem("selected_project_id");
    //alert("Button " + buttonName + " added to the project!");

    $.ajax({
        type: "POST",
        url: baseServiceUrl + "/control",
        data: { 
            projectId: project_id,
            buttonName: buttonName             
        },
        success: function (data) {

            if (data.status === "Success") {

                console.log("data received from delete project:")
                console.log(data);
                console.log("data received from delete project:")

                //window.location.reload();

            }
        },

    });
}

function editProject() {
    console.log("editProject");
    console.log(localStorage.getItem("selected_project_id"));
    console.log(localStorage.getItem("selected_project_name"));
    $('#project_modal').modal('hide');

    window.location.href = baseServerUrl + "/workspace.html";
}

function populateProjectsTable(projects) {

    console.log(projects);
    var projects_table = document.getElementById("projects_table");
    var tbody = projects_table.getElementsByTagName("tbody")[0];

    for (index in projects) {

        var project = projects[index];

        var tr = document.createElement("tr");
        var td_project_id = document.createElement("td");
        var td_project_name = document.createElement("td");

        tr.setAttribute("onclick", "openModal(this)");

        td_project_id.appendChild(document.createTextNode(project.id));
        td_project_name.appendChild(document.createTextNode(project.name));

        tr.appendChild(td_project_id);
        tr.appendChild(td_project_name);
        tbody.appendChild(tr);

    }

}

function downloadProject() {
    console.log(localStorage.getItem("selected_project_id"));
    console.log(localStorage.getItem("selected_project_name"));

    var project_id = localStorage.getItem("selected_project_id");

    $.ajax({
        type: "GET",
        url: baseServiceUrl + "/download/" + project_id,
        success: function (data) {

            if (data.status === "Success") {

                console.log("data received from download project:")
                console.log(data);
                console.log("data received from download project:")

                var content = baseServiceUrl + "/app-release-unsigned.apk";
                var dl = document.createElement('a');
                dl.setAttribute('href', '');
                dl.setAttribute('download', 'app-release.apk');
                dl.click();
            }
        },

    });

    alert("Please wait until the project is built and downloaded..");
}

function createNewProject() {
    var project_name_input = document.getElementById("project_name_textbox_id");
    var project_name = project_name_input.value;
    var userId = localStorage.getItem("userID");

    console.log("project_name");
    console.log(project_name);

    console.log("userId");
    console.log(userId);

    $.ajax({
        type: "POST",
        url: baseServiceUrl + "/projects/" + userId,
        data: { projectName: project_name },
        success: function (data) {
            console.log("Create project callback:");
            console.log(data);
            if (data.status === "Success") {

                alert("Project " + project_name + " was successfully created!");

                window.location.reload();
            }
            else {
                alert("Error while creating project");
            }
        }
    });

}
