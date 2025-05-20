require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const { Schema } = mongoose;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const UserSchema = new Schema({
  username: { type: String, required: true }
});
const User = mongoose.model("User", UserSchema);
const ExerciseSchema = new Schema({
  username: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: String, required: false }
});
const Exercise = mongoose.model("Exercise", ExerciseSchema);

app.post('/api/users', (req, res) => {
  const newUser = new User({ username: req.body.username });
  newUser.save((err, data) => {
    res.json({username: data.username, _id: data["_id"]})
  })
});

app.post('/api/users/:id/exercises', (req, res) => {
  User.findById(req.params.id, (err, data) => {
    if (err) {
      res.send("User not found")
    } else {
    let excDate = "";
    if (req.body.date === "" || req.body.date === undefined) {
      excDate = new Date().toDateString()
    } else {
      excDate = new Date(req.body.date).toDateString()
    }
    const newExe = new Exercise({
      username: data.username,
      description: req.body.description,
      duration: req.body.duration,
      date: excDate
    });
    newExe.save((err, data) => {
      res.json({
        username: data.username,
        description: data.description,
        duration: data.duration,
        date: data.date,
        _id: req.params.id
      })
    })
    }
  })
});
app.get('/api/users', (req, res) => {
  User.find({}, 'username _id', (err, data) => {
    res.send(data);
  })
})

app.get('/api/users/:id/logs', (req, res) => {
  const from = new Date(req.query.from).getTime()
  const to = new Date(req.query.to).getTime()
  const limit = req.query.limit;
  User.findById(req.params.id, (err, user) => {
    Exercise.countDocuments({username: user.username}, (err, count) => {
      Exercise.find({username: user.username}, 'description duration date', (err, data) => {
        if (req.query.limit === undefined) {
          req.query.limit = data.length
        }
      const arr = data.filter(exer => {
        const time = new Date(exer.date).getTime()
        if ( (time >= from || req.query.from === undefined) && (time <= to || req.query.to === undefined) ) {
          return true;
        } else {
          return false;
        }
        }).slice(0, limit)
      res.json({username: user.username, count: count, _id: req.params.id, log: arr})
      })
    })
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
