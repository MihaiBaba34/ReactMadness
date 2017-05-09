var selectedItem = "E";
var level = 1;
var optiune5050 = 1;
var optiuneIntrPublicul = 1;
var optiuneSunaPrieten = 1;
var raspunsCorect = "";
var pragAtins = 0;
var castigulAcumulat = 0;
var vectorCastiguri = [100, 200, 300, 500, 1000, 1500,
3000, 5000, 7500, 15000, 25000,
50000, 100000, 250000, 1000000];
var userId;



$(document).ready(function () {
    $("#formInregistrareUser").submit(function (e) {

        e.preventDefault(); // avoid to execute the actual submit of the form.

        var url = "http://localhost:7000/register";

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

        var url = "http://localhost:7000/registerAdmin";

        $.ajax({
            type: "POST",
            url: url,
            data: $("#formInregistrareAdmin").serialize(), // serializes the form's elements.
            success: function (data) {
                alert(data); // show response from the php script.
            }
        });
    });

$("#formLoginUser").submit(function (e) {

        console.log("login")

        e.preventDefault(); // avoid to execute the actual submit of the form.
        var url = "http://localhost:7000/login";
        $.ajax({
            type: "POST",
            url: url,
            data: $("#formLoginUser").serialize(), // serializes the form's elements.
            success: function (data) {                    
                console.log("From authentication");
                userId = data;
                console.log(data);
                console.log("From authentication"); 
                getProjects();
            }
        });
    });

function getProjects(){
    $.ajax({
        type: "GET",
        url: "/projects/" + userId,
        host: "http://localhost:7000",
        success: function (data) {
            var body = WrapProjects(data.projects);
            

            document.getElementsByTagName('body')[0].innerHTML = body;


        }
    });
}

function WrapProjects(projects){
    var body = "<table>";
    body += "<th>";
    body += "Id";
    body += "</th";
    body += "<th>";
    body += "Name";
    body += "</th";    
    for(project in projects){
        body += "<tr>";

        body += "<td>";
        body += project.id;        
        body += "</td";
        body += "<td>";
        body += project.name;        
        body += "</td";

        body += "</tr";
    }
    body += "</table>"

    body += '<button onClick="createProject()">Create Project</button>';

    return body;
}


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

});

function createProject(){

    console.log(userId);

    $.ajax({
        type: "POST",
        url: "/projects/" + userId.userId,
        host: "http://localhost:7000",
        data: { projectName : "HelloWorld" },
        success: function (data) {
            if (data.isValid === 1) {
                window.location.href = "/projects/" + userId.userId;
            }
            else {
                alert("Error while creating project");
            }
        }
    });
}




