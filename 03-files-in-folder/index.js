const fs = require('fs').promises;
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

async function readDirectory() {
  try {
    const files = await fs.readdir(folderPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        const fileStats = await fs.stat(filePath);
        
        const fileName = path.parse(file.name).name;
        const fileExtension = path.parse(file.name).ext.replace('.', '');
        const fileSize = fileStats.size / 1024;

        console.log(`${fileName} - ${fileExtension} - ${fileSize.toFixed(3)}kb`);
      }
    }
  } catch (err) {
    console.error(`Error reading directory: ${err.message}`);
  }
}

readDirectory();
