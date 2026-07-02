const express = require('express');
const router = express.Router();
const { getTables, createTable, updateTable, deleteTable } = require('../controllers/tableController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(protect, getTables)
  .post(protect, admin, createTable);

router.route('/:id')
  .put(protect, admin, updateTable)
  .delete(protect, admin, deleteTable);

module.exports = router;
