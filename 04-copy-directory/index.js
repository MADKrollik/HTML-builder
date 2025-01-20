const fs = require('fs/promises');
const path = require('path');

async function copyDirectory(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const items = await fs.readdir(src, { withFileTypes: true });

  for (const item of items) {
    const srcPath = path.join(src, item.name);
    const destPath = path.join(dest, item.name);

    if (item.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function copy() {
  const srcFolder = path.join(__dirname, 'files');
  const destFolder = path.join(__dirname, 'files-copy');

  try {
    await fs.rm(destFolder, { recursive: true, force: true });
    await copyDirectory(srcFolder, destFolder);
    console.log('Files copied successfully!');
  } catch (error) {
    console.error('Error copying directory:', error.message);
  }
}

copy();
