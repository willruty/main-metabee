import { app, BrowserWindow } from "electron";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: path.join(__dirname, "../build/icon.ico"), // ícone customizado
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    });
    const devServer = process.env.VITE_DEV_SERVER_URL;
    if (devServer) {
        // Ambiente de desenvolvimento
        win.loadURL(devServer);
        win.webContents.openDevTools();
    }
    else {
        // Ambiente de produção (build final .exe)
        const indexPath = path.join(app.getAppPath(), "dist", "index.html");
        win.loadFile(indexPath);
    }
}
app.whenReady().then(() => {
    createWindow();
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        app.quit();
});
