const Album = require('../models/album');
const User = require("../models/user");


exports.createAlbum = (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const album = new Album({
    name: req.body.name,
    date: Date.parse(req.body.date),
    creator: {
      id: req.userData.userId,
      firstName: req.body.userFirstName,
      lastName: req.body.userLastName,
      email: req.body.userEmail,
      userImage: req.body.userImage
    }
  });
  req.files.forEach(file => {
    album.images.push(url + "/albumImages/" + file.filename)
  });
  album.save().then(createdAlbum => {
    res.status(201).json({
      message: 'Post added successfully',
      post: {
        ...createdAlbum,
        id: createdAlbum._id
      }
   });
  })
  .catch(error => {
    res.status(500).json({
      message: "Creating a post failed!"
    })
  });
};

exports.getAlbums = (req, res, next) => {
  Album.find({"creator.id": req.userData.userId}).then(albums => {
    if (albums) {
      res.status(200).json(albums);
    } else {
      res.status(404).json({message: 'Post not found!'});
    }
  }).catch(error => {
    res.status(500).json({
      message: "Fetching post failed!"
    })
  });
};
