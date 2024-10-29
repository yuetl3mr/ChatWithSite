const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware.js");

const controller = require("../controllers/note-controller")

router.get('/', authMiddleware.requireAuth, controller.index);
router.post('/create', authMiddleware.requireAuth, controller.create);
router.patch('/edit/:id', authMiddleware.requireAuth, controller.edit);
router.delete('/delete/:td', authMiddleware.requireAuth, controller.delete);

module.exports = router;