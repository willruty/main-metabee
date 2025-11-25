const fs = require('fs');
const path = require('path');

const distElectronPath = path.join(__dirname, '..', 'dist_electron');
const electronSourcePath = path.join(__dirname, '..', 'electron');

// Arquivos para renomear de .js para .cjs
const filesToRename = ['main.js', 'preload.js'];

filesToRename.forEach(file => {
  const oldPath = path.join(distElectronPath, file);
  const newPath = path.join(distElectronPath, file.replace('.js', '.cjs'));
  
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`✅ Renamed ${file} to ${file.replace('.js', '.cjs')}`);
  } else {
    console.log(`⚠️  File ${file} not found, skipping...`);
  }
});

// Copiar favicon.ico para dist_electron se não existir
const faviconSource = path.join(electronSourcePath, 'favicon.ico');
const faviconDest = path.join(distElectronPath, 'favicon.ico');

if (fs.existsSync(faviconSource) && !fs.existsSync(faviconDest)) {
  fs.copyFileSync(faviconSource, faviconDest);
  console.log('✅ Copied favicon.ico to dist_electron');
} else if (fs.existsSync(faviconDest)) {
  console.log('ℹ️  favicon.ico already exists in dist_electron');
} else {
  console.log('⚠️  favicon.ico not found in electron folder');
}

