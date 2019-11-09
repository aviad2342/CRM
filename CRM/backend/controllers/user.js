const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      birthDate: Date.parse(req.body.birthDate),
      email: req.body.email,
      password: hash,
      userImage: url + "/userImages/" + req.file.filename
    });
    user.save().then(result => {
      res.status(201).json({
        message: 'User created!',
        user: {
          ...result,
          id: result._id
        }
      });
    }).catch(err => {
      res.status(500).json({
          message: "Invalid authentication credentials!"
      });
    });
  });
}

exports.userLogin = (req, res, next) => {
  let fetchdUser;
  User.findOne({ email: req.body.email }).then(user => {
    if (!user) {
      return res.status(401).json({
        message: "Auth failed"
      });
    }
    fetchdUser = user;
    return bcrypt.compare(req.body.password, user.password);
  }).then(result => {
    if (!result) {
      return res.status(401).json({
        message: "Auth failed"
      });
    }
    const token = jwt.sign({email: fetchdUser.email, userId: fetchdUser._id},
      process.env.JWT_KEY,
      { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchdUser._id,
        firstName: fetchdUser.firstName,
        lastName: fetchdUser.lastName,
        email: fetchdUser.email,
        password: fetchdUser.password,
        birthDate: fetchdUser.birthDate,
        userImage: fetchdUser.userImage
      });
  }).catch(err => {
    return res.status(401).json({
      message: "Invalid authentication credentials!"
    });
  });
}

exports.getUserAvatar = (req, res, next) => {
  User.findOne({ email: req.params.email }).then(user => {
    if (user) {
      res.status(200).json(user.userImage);
    } else {
      res.status(404).json("http://localhost:3000/userImages/defaultUserImage.png");
    }
  }).catch(error => {
    res.status(500).json({
      message: "Fetching post failed!"
    })
  });
};

exports.getUser = (req, res, next) => {
  User.findById(req.params.id).then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({message: 'User not found!'});
    }
  }).catch(error => {
    res.status(500).json({
      message: "Fetching user failed!"
    })
  });
  };

