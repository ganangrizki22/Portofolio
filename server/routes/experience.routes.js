const express = require("express");
const router = express.Router();
const { getExperience } = require("../controllers/experience.controller");

router.get("/", getExperience);

module.exports = router;
