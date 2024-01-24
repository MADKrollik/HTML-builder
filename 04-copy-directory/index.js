const { promises: fsPromises, constants } = require('fs');
const path = require('path');

const sourceFolder = path.join(__dirname, 'files');
const destinationFolder = path.join(__dirname, 'files-copy');

async function copyDirectory() {
  try {
    await fsPromises.rm(destinationFolder, { force: true, recursive: true });

    await fsPromises.mkdir(destinationFolder, { recursive: true });

    const files = await fsPromises.readdir(sourceFolder, { withFileTypes: true });

    for (const file of files) {
      const fileStartPath = path.join(sourceFolder, file.name);
      const fileDestinationFolder = path.join(destinationFolder, file.name);

      await fsPromises.copyFile(fileStartPath, fileDestinationFolder);
    }
    
    console.log('Directory successfully copied.');
  } catch (err) {
    console.error(`Error when copying a directory: ${err.message}`);
  }
}

copyDirectory();
