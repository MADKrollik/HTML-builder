const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const pathToFile = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(pathToFile);

function handleInput(chunk) {
  if (chunk.toString().includes('exit')) {
    process.exit();
  }
  output.write(chunk);
}

process.on('exit', () => {
  stdout.write('\nFarewell! Exiting...');
});

process.on('SIGINT', () => {
  process.exit();
});

stdout.write('Enter text (Ctrl+C or type "exit" to exit):\n');

stdin.on('data', handleInput);
