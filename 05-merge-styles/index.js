const fs = require('fs/promises');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist');
const bundleFilePath = path.join(distDir, 'bundle.css');

async function buildCSSBundle() {
  try {
    const files = await fs.readdir(stylesDir, { withFileTypes: true });

    let stylesArray = [];

    for (const file of files) {
      const filePath = path.join(stylesDir, file.name);

      if (file.isFile() && path.extname(file.name) === '.css') {
        const content = await fs.readFile(filePath, 'utf-8');
        stylesArray.push(content);
      }
    }

    await fs.writeFile(bundleFilePath, stylesArray.join('\n'), 'utf-8');
    console.log('CSS bundle created!');
  } catch (err) {
    console.error('Error building CSS bundle:', err);
  }
}

buildCSSBundle();
