const express = require('express');
const router = express.Router();
const { getUsersController } = require('../controllers/adminController');
const { isAdmin } = require('../middleware/auth');


router
    .get('/get-users', isAdmin, getUsersController);

module.exports = router;