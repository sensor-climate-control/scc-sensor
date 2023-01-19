const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

function createWindow() {
	const win = new BrowserWindow({
		width: 768,
		height: 560,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	});

	ipcMain.handle('create-file', (req, data) => {
		if (!data || !data.ssid || !data.pass || !data.aName || !data.rasip) return false;
		// var pathDown = app.getPath("./Generated Ino");
		fs.mkdirSync(`./${data.aName}`);
		var beforessid = fs.readFileSync("./existingIno/beforessid.txt").toString('utf-8');
		var beforepass = fs.readFileSync("./existingIno/beforepass.txt").toString('utf-8');
		var beforerasip = fs.readFileSync("./existingIno/beforerasip.txt").toString('utf-8');
		var end = fs.readFileSync("./existingIno/end.txt").toString('utf-8');
		var stringToWrite = beforessid.concat(data.ssid, beforepass, data.pass, beforerasip, data.rasip, end);
		const filePath = path.join(`./${data.aName}`, `${data.aName}.ino`);
		fs.writeFileSync(filePath, stringToWrite);

		return { success: true, filePath };
	})

	ipcMain.handle('burn', (req) => {
		// var test;
		return execTest();
		// exec("ls", (error) => {
		// 	if(error) {
		// 		return {fail: test};
		// 	}
		// 	else {
		// 		return {fail: test};
		// 	}
		// });
	})

	win.loadFile(path.join(__dirname, 'src/index.html'));
}

async function execTest() {
	const {stdout, stderr } = await exec(`ls ${__dirname}`);
	console.log(stdout);
	return true; 
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
})