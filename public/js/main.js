 var selectedItem = "E";
var level = 1;
var optiune5050 = 1;
var optiuneIntrPublicul = 1;
var optiuneSunaPrieten = 1;
var raspunsCorect = "";
var pragAtins = 0;
var castigulAcumulat = 0;
var vectorCastiguri = [100,200,300,500,1000,1500,
						3000,5000,7500,15000,25000,
						50000,100000,250000,1000000];



$(document).ready(function()
{	
	$("#formInregistrareUser").submit(function(e){
		
		e.preventDefault(); // avoid to execute the actual submit of the form.

		var url = "http://localhost:7000/registerUser";

		$.ajax({
           type: "POST",
           url: url,
           data: $("#formInregistrareUser").serialize(), // serializes the form's elements.
           success: function(data)
           {
               //alert(data); // show response from the php script.
               window.location.href = "/VreiSaFiiMilionarGame";

           }
         });

	});

	$("#formInregistrareAdmin").submit(function(e){
		
		e.preventDefault(); // avoid to execute the actual submit of the form.

		var url = "http://localhost:7000/registerAdmin";

		$.ajax({
           type: "POST",
           url: url,
           data: $("#formInregistrareAdmin").serialize(), // serializes the form's elements.
           success: function(data)
           {
               alert(data); // show response from the php script.
           }
         });
	});

	$("#formLoginUser").submit(function(e){
		
		e.preventDefault(); // avoid to execute the actual submit of the form.

		var url = "http://localhost:7000/loginUser";

		var username = $("#formLoginUser").find('input[name="username"]').val();
		var password = $("#formLoginUser").find('input[name="password"]').val();

		if(username === "" || password === "")
		{
			alert("Username or password should not be empty!");
		}
		else
		{
			console.log(username + " -> " + password);

			$.ajax({
           type: "POST",
           url: url,
           data: $("#formLoginUser").serialize(), // serializes the form's elements.
           success: function(data)
           {
           	   console.log("From server:***");
               console.log(data);
               console.log("From server:***");
           }
         });
		}
		

	});


	$("#formLoginAdministrator").submit(function(e){
		
		e.preventDefault(); // avoid to execute the actual submit of the form.

		var url = "http://localhost:7000/loginAdmin";

		$.ajax({
           type: "POST",
           url: url,
           data: $("#formLoginAdministrator").serialize(), // serializes the form's elements.
           success: function(data)
           {
               if(data.isValid === 1)
               {
               	window.location.href = "/administratorPage";
               }
               else
               {
               	alert("Nume admin sau parola incorecte!");
               }
           }
         });

	});

});






