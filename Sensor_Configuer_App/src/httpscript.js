const title_el = document.getElementById('title');
//title_el.innerText = api.title;

const ssid_el = document.getElementById('ssid');
const pass_el = document.getElementById('pass');
const aLocation_el = document.getElementById('aLocation');
//const homeid_el = document.getElementById('homeid');
//const server_el = document.getElementById('server');
var error = document.getElementById("error");
const submit_el = document.getElementById('Submit');



submit_el.addEventListener('click', async () => {
	const ssid = ssid_el.value;
	const pass = pass_el.value;
	const aLocation = aLocation_el.value;
	//const homeid = homeid_el.value;
	const homeid = sessionStorage.getItem("homeid");
	//const server = server_el.value;
	const server = sessionStorage.getItem("server");
	const token = sessionStorage.getItem("token");
	const userid = sessionStorage.getItem("userid");
    const method = "http";

	const res = await api.createIno({
		ssid,
		pass,
		aLocation,
		homeid,
		method,
		server,
		token,
		userid,
	})

	console.log(res);
	if (res.success == true) {
		console.log("Success!!!!")
        //ssid_el.value = "";
        //pass_el.value = "";
        aLocation_el.value = "";
        //homeid_el.value = "";
        //server_el.value = "";
		error.textContent = "Success! Please Navigate To Sensor_Configurer In Your Downloads Folder";
		error.style.color = "white";
	} else {
		//error.textContent = sessionStorage.getItem("homeid");
		error.textContent = "Please ensure that all fields are complete";
		error.style.color = "red";
	}
	//ssid_el.value = "";
	//pass_el.value = "";
	//aLocation_el.value = "";
	//homeid_el.value = "";
	//server_el.value = "";
})