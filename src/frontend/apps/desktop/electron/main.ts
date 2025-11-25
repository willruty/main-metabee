import { app, BrowserWindow, ipcMain } from "electron"
import path from "path"
import fs from "fs"

function createWindow() {
  // Determinar o caminho do preload baseado no ambiente
  // O TypeScript compila para dist_electron, então o preload.js estará lá
  // Em desenvolvimento, __dirname aponta para dist_electron (onde o main.js compilado está)
  // Em produção, também aponta para o mesmo local
  const preloadPath = path.join(__dirname, "preload.cjs");

  // Caminho do ícone - tentar dist_electron primeiro, depois electron original
  const iconPath = path.join(__dirname, "favicon.ico");
  const electronIconPath = path.join(__dirname, "..", "electron", "favicon.ico");
  const finalIconPath = fs.existsSync(iconPath) ? iconPath : electronIconPath;
  
  console.log("🔧 Preload path:", preloadPath);
  console.log("🔧 __dirname:", __dirname);
  console.log("🔧 Icon path:", finalIconPath);
  console.log("🔧 Icon exists:", fs.existsSync(finalIconPath));

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: finalIconPath, // ícone customizado
    autoHideMenuBar: true,
    frame: false, // Remove a barra de título nativa
    titleBarStyle: 'hidden', // Esconde a barra de título no macOS
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath, // Script de preload para IPC
    },
  })

  const devServer = process.env.VITE_DEV_SERVER_URL

  if (devServer) {
    // Ambiente de desenvolvimento
    win.loadURL(devServer)
    win.webContents.openDevTools()
  } else {
    // Ambiente de produção (build final .exe)
    const indexPath = path.join(app.getAppPath(), "dist", "index.html")
    win.loadFile(indexPath)
  }

  win.webContents.session.setPermissionRequestHandler(() => false);

  // Handlers IPC para controle da janela
  ipcMain.handle("window-minimize", () => {
    win.minimize();
  });

  ipcMain.handle("window-maximize", () => {
    win.maximize();
  });

  ipcMain.handle("window-restore", () => {
    win.restore();
  });

  ipcMain.handle("window-close", () => {
    win.close();
  });

  ipcMain.handle("window-is-maximized", () => {
    return win.isMaximized();
  });

  // Ouvir mudanças no estado da janela
  win.on("maximize", () => {
    win.webContents.send("window-maximized");
  });

  win.on("unmaximize", () => {
    win.webContents.send("window-unmaximized");
  });

  return win;
}

app.whenReady().then(() => {
  createWindow()

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit()
})
