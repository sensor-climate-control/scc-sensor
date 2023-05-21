const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
var XMLHttpRequest = require('xhr2');
const fetch = require('node-fetch');
const {shell} = require('electron')
globalThis.fetch = fetch

function createWindow() {
	const win = new BrowserWindow({
		width: 880,
		height: 560,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	});

	ipcMain.handle('create-file', (req, data) => {
		if (!data || !data.ssid || !data.pass || !data.aLocation || !data.homeid || !data.method || !data.server || !data.token || !data.userid || !data.interval) return {success: false, error: "Please ensure that all fields are complete"};
		if (data.method == "mqtt" && !data.rasip) return {	success: false, error: "Docker IP is blank"};
		if (data.aLocation.indexOf(' ') >= 0) return { success: false, error: "Sensor Module Location Cannot Contain Spaces"};
		if (Number(data.interval) > 360*60000 || Number(data.interval) < 1*60000) return {success: false, error: "Time between readings must be in the range 1 - 360"};
		if (data.method == "mqtt") {
			fetch(`https://${data.server}/api/homes/${data.homeid}/sensors/`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${data.token}`,
					"Content-Type": 'application/json',
				},
				body: JSON.stringify({
					home: data.homeid,
					name: data.aLocation,
					active: true,
					location: data.aLocation,
					readings: []				
				}),
			}).then(res => {
				return res.json();
			}).then(sensorPostData => {
				var sensorid = sensorPostData.id;
				var pathDown = app.getPath("downloads");
				var SECRET_SSID = `#define SECRET_SSID "${data.ssid}"\n`;
				var SECRET_PASS = `#define SECRET_PASS "${data.pass}"\n`;
				var SECRET_BROKER = `#define SECRET_BROKER "${data.rasip}"\n`;
				var SECRET_SENSORTOPIC = `#define SECRET_SENSORTOPIC "sensors/${sensorid}/readings"\n`;
				var SECRET_SERVER = `#define SECRET_SERVER "${data.server}"\n`;
				var SECRET_HOMEURL = `#define SECRET_HOMEURL "/api/homes/${data.homeid}/"\n`;
				var SECRET_TOKEN = `#define SECRET_TOKEN "NA"\n`;
				var SECRET_METHOD = `#define SECRET_METHOD "${data.method}"\n`;
				var SECRET_INTERVAL = `#define SECRET_INTERVAL "${data.interval}"`;
				var arduinoSecretsString = SECRET_SSID.concat(SECRET_PASS, SECRET_BROKER, SECRET_SENSORTOPIC, SECRET_SERVER, SECRET_HOMEURL, SECRET_TOKEN, SECRET_METHOD, SECRET_INTERVAL);
				var configSensorFolderPath = "/sensor_Configurer";
				var folderpath = pathDown.concat(configSensorFolderPath);
				if (!fs.existsSync(folderpath)) {
					fs.mkdirSync(folderpath);
				}
				var innerFolder = folderpath.concat(`/${data.aLocation}`);
				if (!fs.existsSync(innerFolder)) {
					fs.mkdirSync(innerFolder);
				}	
				const filePath = path.join(innerFolder, "arduino_secrets.h");
				fs.writeFileSync(filePath, arduinoSecretsString);
				var inoFilePath = path.join(__dirname, 'src/existingIno/sensor_Configurer.ino');
				var bashFilePath = path.join(__dirname, 'src/bashScript/burn.sh');
				fs.copyFileSync(inoFilePath, `${innerFolder}/${data.aLocation}.ino`);
				fs.copyFileSync(bashFilePath, `${innerFolder}/burn.sh`);
				var innerFolderPath = innerFolder.replaceAll('/', '\\');
				shell.showItemInFolder(`${innerFolderPath}\\burn.sh`);			
			})
			return { success: true };			
		} else {
			fetch(`https://${data.server}/api/homes/${data.homeid}/sensors/`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${data.token}`,
					"Content-Type": 'application/json',
				},
				body: JSON.stringify({
					home: data.homeid,
					name: data.aLocation,
					active: true,
					location: data.aLocation,
					readings: []				
				}),
			}).then(res => {
				return res.json();
			}).then(sensorPostData => {
				var sensorid = sensorPostData.id;
				fetch(`https://${data.server}/api/users/${data.userid}/tokens`, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${data.token}`,
						"Content-Type": 'application/json',
					},
					body: JSON.stringify({
						duration: "365y",
						name: `${data.aLocation} Sensor`,					
					}),
				}).then(res => {
					return res.json();
				}).then(tokendata => {
					var pathDown = app.getPath("downloads");
					var SECRET_SSID = `#define SECRET_SSID "${data.ssid}"\n`;
					var SECRET_PASS = `#define SECRET_PASS "${data.pass}"\n`;
					if (!data.rasip) {
						var SECRET_BROKER = `#define SECRET_BROKER "NA"\n`;
					} else {
						var SECRET_BROKER = `#define SECRET_BROKER "${data.rasip}"\n`;
					}
					var SECRET_SENSORTOPIC = `#define SECRET_SENSORTOPIC "sensors/${sensorid}/readings"\n`;
					var SECRET_SERVER = `#define SECRET_SERVER "${data.server}"\n`;
					var SECRET_HOMEURL = `#define SECRET_HOMEURL "/api/homes/${data.homeid}/"\n`;
					var SECRET_TOKEN = `#define SECRET_TOKEN "Bearer ${tokendata.token}"\n`; //this should be the token that gets posted
					var SECRET_METHOD = `#define SECRET_METHOD "${data.method}"\n`;
					var SECRET_INTERVAL = `#define SECRET_INTERVAL "${data.interval}"`;
					var arduinoSecretsString = SECRET_SSID.concat(SECRET_PASS, SECRET_BROKER, SECRET_SENSORTOPIC, SECRET_SERVER, SECRET_HOMEURL, SECRET_TOKEN, SECRET_METHOD, SECRET_INTERVAL);
					var configSensorFolderPath = "/sensor_Configurer";
					var folderpath = pathDown.concat(configSensorFolderPath);
					if (!fs.existsSync(folderpath)) {
						fs.mkdirSync(folderpath);
					}
					var innerFolder = folderpath.concat(`/${data.aLocation}`);
					if (!fs.existsSync(innerFolder)) {
						fs.mkdirSync(innerFolder);
					}	
					const filePath = path.join(innerFolder, "arduino_secrets.h");
					fs.writeFileSync(filePath, arduinoSecretsString);
					var inoFilePath = path.join(__dirname, 'src/existingIno/sensor_Configurer.ino');
					var bashFilePath = path.join(__dirname, 'src/bashScript/burn.sh');
					fs.copyFileSync(inoFilePath, `${innerFolder}/${data.aLocation}.ino`);
					fs.copyFileSync(bashFilePath, `${innerFolder}/burn.sh`);
					var innerFolderPath = innerFolder.replaceAll('/', '\\');
					shell.showItemInFolder(`${innerFolderPath}\\burn.sh`);				
				})
			})
			return { success: true };
		}
	})
	win.loadFile(path.join(__dirname, 'src/login.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
})