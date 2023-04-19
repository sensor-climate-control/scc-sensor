const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
var XMLHttpRequest = require('xhr2');

function createWindow() {
	const win = new BrowserWindow({
		width: 768,
		height: 560,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	});

	ipcMain.handle('create-file', (req, data) => {
		if (!data || !data.ssid || !data.pass || !data.aLocation || !data.homeid || !data.method || !data.server) return false;
		if (data.method == "mqtt" && !data.rasip) return false;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", `https://${data.server}/api/homes/${data.homeid}/sensors/`, true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify({
			home: data.homeid,
			name: data.aLocation,
			active: true,
			location: data.aLocation,
			readings: []
		}));
		xhr.onload = function () {
			var responsePost = JSON.parse(this.responseText);
			var sensorid = responsePost.id;
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
			var SECRET_METHOD = `#define SECRET_METHOD "${data.method}"`;
			var arduinoSecretsString = SECRET_SSID.concat(SECRET_PASS, SECRET_BROKER, SECRET_SENSORTOPIC, SECRET_SERVER, SECRET_HOMEURL, SECRET_METHOD)
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
			fs.copyFileSync("./resources/app/existingIno/sensor_Configurer.ino", `${innerFolder}/${data.aLocation}.ino`);
			fs.copyFileSync("./resources/app/bashScript/burn.sh", `${innerFolder}/burn.sh`);
			//fs.copyFileSync("./resources/app/bashScript/arduino-cli.exe", `${folderpath}/arduino-cli.exe`);
		};
		return { success: true };
	})
	win.loadFile(path.join(__dirname, 'src/start.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
})