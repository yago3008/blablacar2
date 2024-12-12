const express = require('express');
const router = express.Router();
const { getUsersController, getRatesController } = require('../controllers/adminController');
const { isAdmin } = require('../middleware/auth');

router
    .get('/get-users', isAdmin, getUsersController)
    .get('/get-rates', isAdmin, getRatesController);

module.exports = router;