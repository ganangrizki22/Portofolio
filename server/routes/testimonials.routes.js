const express = require("express");
const router = express.Router();
const { getTestimonials } = require("../controllers/testimonials.controller");

router.get("/", getTestimonials);

module.exports = router;
