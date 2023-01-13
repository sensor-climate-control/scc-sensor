const title_el = document.getElementById('title');
title_el.innerText = api.title;

const ssid_el = document.getElementById('ssid');
const pass_el = document.getElementById('pass');
const aName_el = document.getElementById('aName');
const rasip_el = document.getElementById('rasip');
const submit_el = document.getElementById('Submit');

submit_el.addEventListener('click', async () => {
	const ssid = ssid_el.value;
	const pass = pass_el.value;
	const aName = aName_el.value;
	const rasip = rasip_el.value;

	const res = await api.createIno({
		ssid,
		pass,
		aName,
		rasip
	})

	console.log(res);
	if (res.success == true) {
		console.log("Success!!!!")
	}
	ssid_el.value = "";
	pass_el.value = "";
	aName_el.value = "";
	rasip_el.value = "";
})