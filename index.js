const express = require('express');
const util = require('util');
const path = require('path');
const app = express();
var cors = require('cors');
const { exec } = require('child_process');
const execAsync = util.promisify(exec);
const fs = require('fs');
const csv = require('csv-parser');
const port = 9001;

app.use(express.static(path.join(__dirname, 'client/build')));

app.use(cors());

app.get('/analyzer', async function(req, res) {
  if (!req.query.repo) {
    exec('ls report', (err, stdout, stderr) => {
      if (err) {
        res.send(err);
        console.error(err);
      } else {
        res.send(stdout);
        // let result =
        //   "Histories <br><br>" +
        //   stdout
        //     .split(/\r?\n/)
        //     .map(ele => `<a href="/get-files?name=${ele}">${ele}</a><br>`)
        //     .join("");
        // result += "/?repo=https//username:access-token@git-repository.git";
        // res.send(result);
      }
    });
    return;
  }

  try {
    await execAsync(`git ls-remote --symref ${req.query.repo} HEAD`);
  } catch (e) {
    res.status(404).send({ error: e });
    return;
  }

  exec(`./bin/git-clone.sh ${req.query.repo}`, (err, stdout, stderr) => {
    if (err) {
      res.send(err);
      console.error(err);
    } else {
      console.log(stdout);
      const fileName = stdout.split(/\r?\n/).find(ele => ele.includes('.csv'));
      const ala = {};
      let author = '';
      fs.createReadStream(`report/${fileName}`)
        .pipe(csv())
        .on('data', async row => {
          if (Object.keys(row).length !== 1) {
            ala[author].push(row);
          } else {
            author = row.date;
            ala[author] = [];
          }
        })
        .on('end', async () => {
          res.send(ala);
        });

      // const result =
      //   "<pre>" +
      //   stdout +
      //   `<a href="/get-files?name=${fileName}">Download</a>` +
      //   "</pre>";
      // res.send(result);
    }
  });
});

app.get('/get-files', async function(req, res) {
  res.sendFile(`report/${req.query.name}`, { root: __dirname });
});

const server = app.listen(port, err => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`The app is listening on ${port}! http://localhost:${port}`);
});
server.setTimeout(500000);
