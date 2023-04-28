const email_el = document.getElementById('email');
const password_el = document.getElementById('password');
const server_el = document.getElementById('server');
var error = document.getElementById("error");
const submit_el = document.getElementById('submit');


submit_el.addEventListener('click', async () => {
	login();

})

function login() {
    var email = email_el.value;
    var password = password_el.value;
    var server = server_el.value;
    //var error = error_el.value;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("post", `https://${server}/api/users/login`, true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.send(JSON.stringify({
        email: email,
        password: password
    }));
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var responsePost = JSON.parse(xmlhttp.responseText);
            console.log(responsePost.token);
            sessionStorage.setItem("token", responsePost.token);
            sessionStorage.setItem("userid", responsePost.userid);
            sessionStorage.setItem("server", server);
            console.log(responsePost.userid);
            error.textContent = "Logged in";
            error.style.color = "green";
            //window.location.href = "hardwareSelect.html";
            window.location.href = "homeSelect.html";
            //loginResults();
        }
        if (xmlhttp.readyState == 4 && xmlhttp.status != 200) {
            var responsePost = JSON.parse(xmlhttp.responseText);
            console.log(xmlhttp.responseText);
            error.textContent = responsePost.error;
            error.style.color = "red";

        }
    }
}
//function loginResults() {
//    var error = error_el.value;
//    console.log("got to results");
//    if (xmlhttp.responseText.indexOf("failed") == -1) {
//        error.innerHTML = "Logged in as " + xmlhttp.responseText;
//    } else {
//        error.innerHTML = "Error couldn't login" + xmlhttp.responseText;
//    }
//}

/*

//var XMLHttpRequest = require('xhr2');
const email_el = document.getElementById('email');
const password_el = document.getElementById('password');
const server_el = document.getElementById('server');
const submit_el = document.getElementById('submit');

submit_el.addEventListener('click', async () => {
	const email = email_el.value;
	const password = password_el.value;
	const server = server_el.value;
    try {
        var res = await login(email, password, server);
        console.log(res);
    } catch(error) {
        console.log("Error logging in: ", error);
    }
	//const res = await api.login({
	//	email,
	//	password,
	//	server,
	//})


	//console.log(res);
	//if (res.success == true) {
	//	console.log("Login Complete", res.token, res.userid);
	//	error.textContent = "Success!";
	//	error.style.color = "green";
    //    window.sessionStorage.setItem("token", res.token);
	//	window.sessionStorage.setItem("userid", res.userid);
    //    //window.location.href = "hardwareSelect.html";
	//} else {
	//	error.textContent = "Please ensure that the Server Url is correct and that all fields are complete";
	//	error.style.color = "red";
	//}
	//ssid_el.value = "";
	//pass_el.value = "";
	//aLocation_el.value = "";
	//homeid_el.value = "";
	//server_el.value = "";
})

function login(email, password, server) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", `https://${server}/api/users/login`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            var status = xhr.status;
            if (status == 200) {
                var token = "";
                var userid = "";
                var responsePost = JSON.parse(this.responseText);
                token = responsePost.token;
                userid = responsePost.userid;
                window.sessionStorage.setItem("token" , token);
                window.sessionStorage.setItem("userid" , userid);
                resolve(status);
            } else {
                reject(status);
            }
            //var responsePost = JSON.parse(this.responseText);
        };
        xhr.send(JSON.stringify({
			email: email,
			password: password
		}));
    });
}
*/
