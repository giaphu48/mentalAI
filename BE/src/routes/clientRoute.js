const express = require('express');
const router = express.Router();
const controller = require('../controllers/clientController');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.post('/register', controller.createClient);
router.post('/login', controller.loginClient);
router.get('/', controller.getClients);
router.get('/getbyid/:id', controller.getClientById);
router.get('/email/:email', controller.getIdByEmail);
router.put('/verify/:id', controller.verifyClient);
router.put('/:id', controller.updateClient);
router.delete('/:id', controller.deleteClient);
router.delete('/', controller.deleteAllClients);
router.post('/:id/avatar', upload.single('avatar'), controller.uploadAvatar);


module.exports = router;
