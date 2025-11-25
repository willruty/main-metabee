import { contextBridge, ipcRenderer } from "electron";

console.log("🔧 Preload script carregado!");

// Expor APIs seguras para o renderer
contextBridge.exposeInMainWorld("electronAPI", {
  // Funções de controle da janela
  minimizeWindow: () => ipcRenderer.invoke("window-minimize"),
  maximizeWindow: () => ipcRenderer.invoke("window-maximize"),
  restoreWindow: () => ipcRenderer.invoke("window-restore"),
  closeWindow: () => ipcRenderer.invoke("window-close"),
  isMaximized: () => ipcRenderer.invoke("window-is-maximized"),
  
  // Ouvir mudanças no estado da janela
  onWindowMaximize: (callback: () => void) => {
    ipcRenderer.on("window-maximized", callback);
    return () => ipcRenderer.removeAllListeners("window-maximized");
  },
  onWindowUnmaximize: (callback: () => void) => {
    ipcRenderer.on("window-unmaximized", callback);
    return () => ipcRenderer.removeAllListeners("window-unmaximized");
  },
});

