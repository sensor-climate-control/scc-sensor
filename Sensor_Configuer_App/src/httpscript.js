const title_el = document.getElementById('title');
//title_el.innerText = api.title;

const ssid_el = document.getElementById('ssid');
const pass_el = document.getElementById('pass');
const aLocation_el = document.getElementById('aLocation');
const interval_el = document.getElementById('interval');
var error = document.getElementById("error");
const submit_el = document.getElementById('Submit');



submit_el.addEventListener('click', async () => {
	const ssid = ssid_el.value;
	const pass = pass_el.value;
	const aLocation = aLocation_el.value;
	const homeid = sessionStorage.getItem("homeid");
	const interval = interval_el.value * 60000; //convert minutes to milliseconds
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
		interval,
	})

	console.log(res);
	if (res.success == true) {
		console.log("Success!!!!");
        aLocation_el.value = "";
		error.textContent = `Success! Please run the burn.sh script at Downloads/sensor_Configurer/${aLocation}/burn.sh. After if you want to create another sensor simply enter in the location of the new sensor above and resubmit with the new sensor module plugged in`;
		error.style.color = "#cfeaeb";
	} else {
		error.textContent = res.error;
		//error.textContent = "Please ensure that all fields are complete and Sensor Module Location contains no spaces";
		error.style.color = "red";
	}
})