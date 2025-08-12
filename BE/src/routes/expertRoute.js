const express = require('express');
const controller = require('../controllers/expertController');
const router = express.Router();
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload')

router.post('/register', controller.createExpert);
router.get('/', controller.getAllExpert);
router.get('/getbyid/:id', controller.getExpertById);
router.post('/:id/avatar', upload.single('avatar'), controller.uploadAvatar);
router.put('/:id', controller.updateExpert);
router.delete('/:id', controller.deleteExpert);

module.exports = router;