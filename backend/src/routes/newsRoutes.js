const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController'); // Ensure fetchNews is exported correctly

router.get('/news', newsController.fetchNews); // Ensure fetchNews is defined and functional

module.exports = router;