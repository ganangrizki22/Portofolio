const express = require("express");
const { login, callback, getNowPlaying } = require("../controllers/spotify.controller");

const router = express.Router();

router.get("/login", login);
router.get("/callback", callback);
router.get("/now-playing", getNowPlaying);

module.exports = router;
