const express = require("express");

const UserController = require("../controllers/user");

const extractUserImage = require('../middleware/image');

const router = express.Router();

router.post("/signup", extractUserImage, UserController.createUser);

router.post("/login", UserController.userLogin);

router.get("/login/:email", UserController.getUserAvatar);

router.get("/login/get/:id", UserController.getUser);

module.exports = router;
