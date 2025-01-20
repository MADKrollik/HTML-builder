const fs = require('fs/promises');
const path = require('path');

const projectDir = __dirname;
const distDir = path.join(projectDir, 'project-dist'); // Results
const templatePath = path.join(projectDir, 'template.html');
const componentsDir = path.join(projectDir, 'components');
const stylesDir = path.join(projectDir, 'styles');
const assetsDir = path.join(projectDir, 'assets'); // assets
const distAssetsDir = path.join(distDir, 'assets'); // assets copy

// make dir
async function ensureDirExists(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

//Search tags
async function replaceTemplateTags(template) {
  const tagRegex = /\{\{(\w+)\}\}/g;
  let match;
  let result = template;

  while ((match = tagRegex.exec(template)) !== null) {
    const tagName = match[1];
    const componentPath = path.join(componentsDir, `${tagName}.html`);

    try {
      const componentContent = await fs.readFile(componentPath, 'utf-8');
      result = result.replace(
        new RegExp(`\\{\\{${tagName}\\}\\}`, 'g'),
        componentContent,
      );
    } catch (err) {
      console.error(`Error reading ${tagName}:`, err);
    }
  }

  return result;
}

// merge styles
async function mergeStyles() {
  const stylesFilePath = path.join(distDir, 'style.css');
  let stylesArray = [];

  try {
    const files = await fs.readdir(stylesDir, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(stylesDir, file.name);

      if (file.isFile() && path.extname(file.name) === '.css') {
        const content = await fs.readFile(filePath, 'utf-8');
        stylesArray.push(content);
      }
    }

    await fs.writeFile(stylesFilePath, stylesArray.join('\n'), 'utf-8');
    console.log('Styles merged!');
  } catch (err) {
    console.error('Error merging styles:', err);
  }
}

// copy directory
async function copyAssets(src, dest) {
  try {
    await ensureDirExists(dest);
    const items = await fs.readdir(src, { withFileTypes: true });
    for (const item of items) {
      const srcPath = path.join(src, item.name);
      const destPath = path.join(dest, item.name);

      if (item.isDirectory()) {
        await copyAssets(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (err) {
    console.error('Error copying assets:', err);
  }
}

(async () => {
  try {
    await ensureDirExists(distDir);

    const template = await fs.readFile(templatePath, 'utf-8');
    const updatedHtml = await replaceTemplateTags(template);
    await fs.writeFile(path.join(distDir, 'index.html'), updatedHtml, 'utf-8');
    console.log('HTML page built!');

    await mergeStyles();

    await copyAssets(assetsDir, distAssetsDir);
    console.log('Assets copied!');
  } catch (err) {
    console.error('Error during execution:', err);
  }
})();
