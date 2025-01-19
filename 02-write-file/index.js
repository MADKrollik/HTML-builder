const fs = require('fs');
const readline = require('readline');

const filePath = './02-write-file/output.txt';
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(
  'Hello there! Please enter text to save to the file. Type "exit" to quit.',
);

const promptInput = () => {
  rl.question('Enter text: ', (input) => {
    if (input.toLowerCase() === 'exit') {
      console.log('Goodbye!');
      rl.close();
      process.exit(0);
    } else {
      writeStream.write(input + '\n');
      promptInput();
    }
  });
};

process.on('SIGINT', () => {
  console.log('\nGoodbye!');
  rl.close();
  process.exit(0);
});

promptInput();
