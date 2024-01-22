const fsPromises = require('fs').promises;
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const projectDistFolderPath = path.join(rootDir, 'project-dist');
const templateFilePath = path.join(rootDir, 'template.html');
const componentsFolderPath = path.join(rootDir, 'components');
const stylesFolderPath = path.join(rootDir, 'styles');
const assetsFolderPath = path.join(rootDir, 'assets');

async function buildPage() {
  try {
    await fsPromises.mkdir(projectDistFolderPath, { recursive: true });

    await bundleHTML();
    await bundleStyles();
    await copyDirectoryRecursive(assetsFolderPath, path.join(projectDistFolderPath, 'assets'));

    console.log('Build completed successfully.');
  } catch (err) {
    console.error(`Build failed: ${err.message}`);
  }
}

async function bundleHTML() {
  try {
    const pathToHTMLFile = path.join(projectDistFolderPath, 'index.html');
    await copyMainFile(templateFilePath, pathToHTMLFile);

    let HTMLfile = await fsPromises.readFile(pathToHTMLFile, 'utf-8');
    const components = await fsPromises.readdir(componentsFolderPath, { withFileTypes: true });

    const newHTML = await replaceTags(HTMLfile, components, componentsFolderPath);
    await fsPromises.writeFile(pathToHTMLFile, newHTML);
  } catch (err) {
    console.error(`Error bundling HTML: ${err.message}`);
  }
}

async function bundleStyles() {
  try {
    const bundleCssFilePath = path.join(projectDistFolderPath, 'style.css');
    const files = await fsPromises.readdir(stylesFolderPath, { withFileTypes: true });

    const writeStream = fs.createWriteStream(bundleCssFilePath);

    files.forEach((file) => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const filePath = path.join(stylesFolderPath, file.name);
        const readStream = fs.createReadStream(filePath, 'utf-8');
        readStream.pipe(writeStream);
      }
    });

    console.log('Styles successfully compiled into style.css.');
  } catch (err) {
    console.error(`Error bundling styles: ${err.message}`);
  }
}

async function copyMainFile(pathToFile, bundleFile) {
  try {
    const content = await fsPromises.readFile(pathToFile, 'utf-8');
    await fsPromises.writeFile(bundleFile, content);
  } catch (err) {
    console.error(`Error copying main file: ${err.message}`);
  }
}

async function replaceTags(HTMLfile, files, pathDir) {
  try {
    for (let i = 0; i < files.length; i += 1) {
      const filePath = path.join(pathDir, files[i].name);
      if (files[i].isFile() && path.extname(filePath) === '.html') {
        const fileName = files[i].name.slice(0, files[i].name.lastIndexOf('.'));
        const fileData = await fsPromises.readFile(filePath, 'utf-8');
        HTMLfile = HTMLfile.replace(`{{${fileName}}}`, fileData);
      }
    }
    return HTMLfile;
  } catch (err) {
    console.error(`Error replacing tags: ${err.message}`);
    return HTMLfile;
  }
}

async function copyDirectoryRecursive(sourcePath, destinationPath) {
  try {
    await fsPromises.mkdir(destinationPath, { recursive: true });
    const files = await fsPromises.readdir(sourcePath, { withFileTypes: true });
  
    await Promise.all(
      files.map(async (file) => {
        const fileStartPath = path.join(sourcePath, file.name);
        const fileDestinationPath = path.join(destinationPath, file.name);
        if (file.isDirectory()) {
          await copyDirectoryRecursive(fileStartPath, fileDestinationPath);
        } else {
          await fsPromises.copyFile(fileStartPath, fileDestinationPath);
        }
      })
    );
  } catch (error) {
    console.log(error.message);
  }
}

buildPage();
