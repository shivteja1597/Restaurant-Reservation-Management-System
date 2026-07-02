const express = require('express');
const router = express.Router();
const {
  getReservations,
  createReservation,
  cancelReservation,
  updateReservation,
} = require('../controllers/reservationController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(protect, getReservations)
  .post(protect, createReservation);

router.route('/:id')
  .delete(protect, cancelReservation)
  .put(protect, admin, updateReservation);

module.exports = router;
