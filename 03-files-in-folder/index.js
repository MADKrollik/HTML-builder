const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

function displayFilesInfo() {
  fs.readdir(folderPath, { withFileTypes: true }, (err, items) => {
    if (err) {
      console.error('Error reading folder:', err.message);
      return;
    }
    items.forEach((item) => {
      if (item.isFile()) {
        const filePath = path.join(folderPath, item.name);
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.error('Error getting file stats:', err.message);
            return;
          }

          const fileSize = stats.size;
          const fileName = path.parse(item.name).name;
          const fileExt = path.extname(item.name).slice(1);

          console.log(`${fileName} - ${fileExt} - ${fileSize} bytes`);
        });
      }
    });
  });
}

displayFilesInfo();
