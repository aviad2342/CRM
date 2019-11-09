const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require('fs');

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const albumRoutes = require("./routes/album");
const Post = require('./models/post');

const app = express();

mongoose.connect("mongodb+srv://aviad2342:<aviad2510>@cluster0-e4c5o.mongodb.net/test?retryWrites=true&w=majority")
.then(() => {
  console.log('Connected to database!');
}).catch(() => {
  console.log('Connected failed!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));
app.use("/userImages", express.static(path.join("backend/userImages")));
app.use("/albumImages", express.static(path.join("backend/albumImages")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

app.use("/api/posts",postsRoutes);
app.use("/api/user",userRoutes);
app.use("/api/album",albumRoutes);

app.use("/api/images",(req, res, next) => {
  const images = [];
  Post.find({}, 'imagePath -_id', function (err, docs) {
    docs.forEach(element => {
      images.push(element.imagePath);
    });
    fs.readdir("./backend/images", (err, files) => {
      files.forEach(file => {
        if (!images.includes('http://localhost:3000/images/' + file) && file != 'defaultUserImage.png') {
          fs.unlink("./backend/images/" + file, (err) => {
                if (err) throw err;
              });
        }
      });
    });
  });
  res.status(200).json({ message: "deleted!" });
});

module.exports = app;

