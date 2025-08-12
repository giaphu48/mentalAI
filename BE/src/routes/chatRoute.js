const express = require('express');
const router = express.Router();
const controller = require('../controllers/chatController');

router.post("/AI/:sessionId", controller.chatWithAI);
router.post("/AI", controller.chatWithAI);
router.post("/expert/:sessionId", controller.chatWithExpert);
router.get('/history/:id', controller.getChatHistoryBySessionId);
router.get('/sessions', controller.getChatSessions);
router.post('/analyze/:id', controller.analyzeChatSession);

module.exports = router;
