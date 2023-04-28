const title_el = document.getElementById('title');
//title_el.innerText = api.title;

const ssid_el = document.getElementById('ssid');
const pass_el = document.getElementById('pass');
const aLocation_el = document.getElementById('aLocation');
const homeid_el = document.getElementById('homeid');
const method_el = document.getElementsByName('method');
const server_el = document.getElementById('server');
const rasip_el = document.getElementById('rasip');
var error = document.getElementById("error");
const submit_el = document.getElementById('Submit');

submit_el.addEventListener('click', async () => {
	const ssid = ssid_el.value;
	const pass = pass_el.value;
	const aLocation = aLocation_el.value;
	const rasip = rasip_el.value;
	const homeid = homeid_el.value;
	const server = server_el.value;
	//const method_el = method_el.value;
	for(i=0; i < method_el.length; i++) {
		if(method_el[i].checked) {
			var method = method_el[i].value;
		}
	}


	const res = await api.createIno({
		ssid,
		pass,
		aLocation,
		rasip,
		homeid,
		method,
		server,
	})

	console.log(res);
	if (res.success == true) {
		console.log("Success!!!!")
		aLocation_el.value = "";
		rasip_el.value = "";
		homeid_el.value = "";
		method_el.value = "";
		server_el.value = "";
		error.textContent = "";
	} else {
		error.text = "<span style='color: red;'>"+"Please enter a valid number</span>";
	}
	//ssid_el.value = "";
	//pass_el.value = "";

})