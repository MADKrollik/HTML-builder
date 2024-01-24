const fsPromises = require('fs').promises;
const path = require('path');

const stylesFolderPath = path.join(__dirname, 'styles');
const projectDistFolderPath = path.join(__dirname, 'project-dist');
const bundleCssFilePath = path.join(projectDistFolderPath, 'bundle.css');

async function compileStyles() {
  try {
    const files = await fsPromises.readdir(stylesFolderPath);

    const cssFiles = files.filter(file => path.extname(file).toLowerCase() === '.css');

    const bundleContent = await Promise.all(cssFiles.map(async file => {
      const filePath = path.join(stylesFolderPath, file);
      return await fsPromises.readFile(filePath, 'utf-8');
    }));
    
    await fsPromises.writeFile(bundleCssFilePath, bundleContent.join('\n'), 'utf-8');

    console.log('Styles successfully compiled into bundle.css.');
  } catch (err) {
    console.error(`Error compiling styles: ${err.message}`);
  }
}

compileStyles();
