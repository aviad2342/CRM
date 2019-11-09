const express = require("express");

const AlbumController = require("../controllers/album");

const checkAuth = require('../middleware/check-auth');
const extractAlbumImages = require('../middleware/images');

const router = express.Router();

router.post("", extractAlbumImages, checkAuth, AlbumController.createAlbum);

router.get("", checkAuth, AlbumController.getAlbums);

module.exports = router;
