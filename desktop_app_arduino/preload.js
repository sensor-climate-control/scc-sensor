const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
	title: "Sensor Module Configurer",
	createIno: (data) => ipcRenderer.invoke('create-file', data)
})