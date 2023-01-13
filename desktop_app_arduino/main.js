const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

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
		var pathDown = app.getPath("downloads");
		var beforessid = fs.readFileSync("./existingIno/beforessid.txt").toString('utf-8');
		var beforepass = fs.readFileSync("./existingIno/beforepass.txt").toString('utf-8');
		var beforerasip = fs.readFileSync("./existingIno/beforerasip.txt").toString('utf-8');
		var end = fs.readFileSync("./existingIno/end.txt").toString('utf-8');
		var stringToWrite = beforessid.concat(data.ssid, beforepass, data.pass, beforerasip, data.rasip, end);
		const filePath = path.join(pathDown, `${data.aName}.ino`);
		fs.writeFileSync(filePath, stringToWrite);

		return { success: true, filePath };
	})
	win.loadFile(path.join(__dirname, 'src/index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
})