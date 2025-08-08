const express = require('express');
const router = express.Router();
const controller = require('../controllers/chatController');

router.post("/AI/:sessionId", controller.chatWithAI);
router.post("/AI", controller.chatWithAI);
router.get('/history/:id', controller.getChatHistoryBySessionId);
router.get('/sessions', controller.getChatSessions)

module.exports = router;
