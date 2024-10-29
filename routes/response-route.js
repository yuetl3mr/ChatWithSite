const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware.js");

const controller = require("../controllers/response-controller")

router.post('/', authMiddleware.requireAuth, controller.index);

module.exports = router;