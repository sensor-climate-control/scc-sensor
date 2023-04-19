const title_el = document.getElementById('title');
title_el.innerText = api.title;

const ssid_el = document.getElementById('ssid');
const pass_el = document.getElementById('pass');
const aLocation_el = document.getElementById('aLocation');
const homeid_el = document.getElementById('homeid');
const server_el = document.getElementById('server');
const rasip_el = document.getElementById('rasip');
const submit_el = document.getElementById('Submit');

submit_el.addEventListener('click', async () => {
	const ssid = ssid_el.value;
	const pass = pass_el.value;
	const aLocation = aLocation_el.value;
	const rasip = rasip_el.value;
	const homeid = homeid_el.value;
	const server = server_el.value;
    const method = "mqtt"


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
    	ssid_el.value = "";
        pass_el.value = "";
        aLocation_el.value = "";
        rasip_el.value = "";
        homeid_el.value = "";
        //method_el.value = "";
        server_el.value = "";
	}
	//ssid_el.value = "";
	//pass_el.value = "";
	//aLocation_el.value = "";
	//rasip_el.value = "";
	//homeid_el.value = "";
	//method_el.value = "";
	//server_el.value = "";
})