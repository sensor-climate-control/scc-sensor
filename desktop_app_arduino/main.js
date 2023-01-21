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
		if (!data || !data.ssid || !data.pass || !data.aLocation || !data.rasip || !data.homeid) return false;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", `https://osuscc-testing.azurewebsites.net/api/homes/${data.homeid}/sensors/`, true);
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
			var beforessid = fs.readFileSync("./existingIno/beforessid.txt").toString('utf-8');
			var beforepass = fs.readFileSync("./existingIno/beforepass.txt").toString('utf-8');
			var beforerasip = fs.readFileSync("./existingIno/beforerasip.txt").toString('utf-8');
			var beforesensorid = fs.readFileSync("./existingIno/beforesensorid.txt").toString('utf-8');
			var end = fs.readFileSync("./existingIno/end.txt").toString('utf-8');
			var stringToWrite = beforessid.concat(data.ssid, beforepass, data.pass, beforerasip, data.rasip, beforesensorid, sensorid, end);
			var configSensorFolderPath = "/sensor_Configurer";
			var folderpath = pathDown.concat(configSensorFolderPath);
			if (!fs.existsSync(folderpath)) {
				fs.mkdirSync(folderpath);
			}

			const filePath = path.join(folderpath, "sensor_Configurer.ino");
			fs.writeFileSync(filePath, stringToWrite);
			fs.copyFileSync("./bashScript/burn.sh", `${folderpath}/burn.sh`);
			fs.copyFileSync("./bashScript/arduino-cli.exe", `${folderpath}/arduino-cli.exe`);
		};
		return { success: true };
	})
	win.loadFile(path.join(__dirname, 'src/index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
})