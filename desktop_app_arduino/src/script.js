const title_el = document.getElementById('title');
title_el.innerText = api.title;

const ssid_el = document.getElementById('ssid');
const pass_el = document.getElementById('pass');
const aLocation_el = document.getElementById('aLocation');
const rasip_el = document.getElementById('rasip');
const homeid_el = document.getElementById('homeid');
const submit_el = document.getElementById('Submit');

submit_el.addEventListener('click', async () => {
	const ssid = ssid_el.value;
	const pass = pass_el.value;
	const aLocation = aLocation_el.value;
	const rasip = rasip_el.value;
	const homeid = homeid_el.value;

	const res = await api.createIno({
		ssid,
		pass,
		aLocation,
		rasip,
		homeid
	})

	console.log(res);
	if (res.success == true) {
		console.log("Success!!!!")
	}
	ssid_el.value = "";
	pass_el.value = "";
	aLocation_el.value = "";
	rasip_el.value = "";
	homeid_el.value = "";
})