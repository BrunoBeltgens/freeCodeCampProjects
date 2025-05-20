require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose')
const { Schema } = mongoose;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
// Basic Configuration
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const ShortUrlSchema = new Schema({
  url: { type: String, required: true },
  short: { type: Number, required: true }
});
const ShortUrl = mongoose.model("ShortUrl", ShortUrlSchema);

urlCheck = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
app.post('/api/shorturl', (req, res) => {
  if (urlCheck.test(req.body.url)) {
    ShortUrl.estimatedDocumentCount({}, (err, count) => {
      const url = new ShortUrl({url: req.body.url, short: count + 1});
      url.save((err, data) => {
      res.json({ original_url: data.url, short_url: count + 1 });
      });
    })
  } else {
    res.json({ error: 'invalid url' });
  }
});

app.get('/api/shorturl/:id', (req, res) => {
  const id = req.params.id;
  ShortUrl.findOne({short: id}, (err, data) => {
    if (err) {
      console.log("error");
    } else {
    res.redirect(data.url);
    }
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});