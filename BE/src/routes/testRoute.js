const express = require('express');
const router = express.Router();
const controller = require('../controllers/testController');

router.get('/', controller.getAllMbtiQuestions);
router.post('/', controller.createMbtiQuestions);
router.get('/quiz', controller.getAllMbtiQuiz);
router.get('/:id', controller.getMbtiQuestionById);
router.put('/:id', controller.updateMbtiQuestion);
router.delete('/:id', controller.deleteMbtiQuestion);

module.exports = router;