const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require('./routes/userRoutes')

const connect = mongoose.connect(
  "mongodb+srv://admin:admin@cluster0.ww2is.mongodb.net/test?authSource=admin&replicaSet=atlas-q9mulc-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
connect.then(
  (db) => {
    console.log("Connected correctly to server");
  },
  (err) => {
    console.log(err);
  }
);

var app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/send', (req, res) => {
  res.send('Hello, I am Amueso Backend')
});

app.use("/api/user", userRoutes);

module.exports = app;