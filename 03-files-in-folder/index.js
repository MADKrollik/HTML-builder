const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(`Error reading directory: ${err.message}`);
    return;
  }

  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(folderPath, file.name);
      const fileStats = fs.statSync(filePath);
      
      const fileName = path.parse(file.name).name;
      const fileExtension = path.parse(file.name).ext.replace('.', '');
      const fileSize = fileStats.size / 1024;

      console.log(`${fileName} - ${fileExtension} - ${fileSize.toFixed(3)}kb`);
    }
  });
});
