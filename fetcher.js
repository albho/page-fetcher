const request = require("request");
const fs = require("fs");
const URL = process.argv[2];
const filePath = process.argv[3];
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const writeFile = (filePath, content) => {
  fs.writeFile(filePath, content, err => {
    if (err) {
      return console.error(err);
    }

    // file written successfully - print filesize
    fs.stat(filePath, (err, stats) => {
      if (err) {
        return console.log(`File doesn't exist.`);
      }

      console.log(`Downloaded and saved ${stats.size} bytes to ${filePath}`);
      process.exit();
    });
  });
};

const makeRequest = url => {
  request(url, function (error, response, body) {
    if (error) return console.error("error:", error);

    if (response.statusCode >= 200 && response.statusCode < 300) {
      writeFile(filePath, body);
    } else {
      console.log(`Error: status code ${response.statusCode}`);
    }
  });
};

const targetFile = fs.statSync(filePath);
if (targetFile.size !== 0) {
  rl.question("Target file already has content. Override? (Y)", answer => {
    if (answer.toUpperCase() === "Y") {
      makeRequest(URL);
    } else {
      process.exit();
    }
  });
} else {
  makeRequest(URL);
}
