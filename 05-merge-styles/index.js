const fs = require('fs');
const path = require('path');

const stylesFolderPath = path.join(__dirname, 'styles');
const projectDistFolderPath = path.join(__dirname, 'project-dist');
const bundleCssFilePath = path.join(projectDistFolderPath, 'bundle.css');

function compileStyles() {
  try {
    const files = fs.readdirSync(stylesFolderPath);

    const cssFiles = files.filter(file => path.extname(file).toLowerCase() === '.css');

    const bundleContent = cssFiles.map(file => {
      const filePath = path.join(stylesFolderPath, file);
      return fs.readFileSync(filePath, 'utf-8');
    }).join('\n');

    fs.writeFileSync(bundleCssFilePath, bundleContent, 'utf-8');

    console.log('Styles successfully compiled into bundle.css.');
  } catch (err) {
    console.error(`Error compiling styles: ${err.message}`);
  }
}

compileStyles();
