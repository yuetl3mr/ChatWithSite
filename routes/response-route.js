const express = require("express");
const router = express.Router();

const controller = require("../controllers/response-controller")

router.post('/', controller.index);

module.exports = router;