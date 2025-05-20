// server.js
// where your node app starts
var moment = require('moment'); // require
moment().format();
// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/:date?", function (req, res) {
  let regex = /^[0-9]+$/g;
  if (req.params.date === undefined) {
    req.date = new Date();
    res.json({unix: req.date.getTime(), utc: req.date.toUTCString()});
  } else if (regex.test(req.params.date)) {
    req.date = new Date(+req.params.date);
    res.json({unix: req.date.getTime(), utc: req.date.toUTCString()});
  } else if (moment(req.params.date).isValid()) {
    req.date = new Date(req.params.date);
    res.json({unix: req.date.getTime(), utc: req.date.toUTCString()});
  } else {
    res.json({error : "Invalid Date"});
  }
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
