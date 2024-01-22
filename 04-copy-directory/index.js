const { promises: fsPromises, constants } = require('fs');
const path = require('path');

const sourceFolder = path.join(__dirname, 'files');
const destinationFolder = path.join(__dirname, 'files-copy');

async function copyDirectory() {
  try {
    await fsPromises.access(sourceFolder, constants.F_OK);

    await fsPromises.mkdir(destinationFolder, { recursive: true });

    const files = await fsPromises.readdir(sourceFolder);

    for (const file of files) {
      const sourceFilePath = path.join(sourceFolder, file);
      const destinationFilePath = path.join(destinationFolder, file);

      await fsPromises.copyFile(sourceFilePath, destinationFilePath);
    }

    console.log('Directory successfully copied.');
  } catch (err) {
    console.error(`Error when copying a directory: ${err.message}`);
  }
}

copyDirectory();
