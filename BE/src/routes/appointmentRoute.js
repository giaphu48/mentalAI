const express = require('express');
const router = express.Router();
const controller = require('../controllers/appointmentController');

router.post('/', controller.createAppointment);
router.put('/:id/accept', controller.acceptAppointment);
router.put('/:id/reject', controller.rejectAppointment);
router.get('/expert/:expert_id/', controller.getAllAppointmentsByExpert);

module.exports = router;