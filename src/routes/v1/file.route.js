const express = require('express');
const multer = require('multer');
const { fileController } = require('../../controllers/index');

const uploadMulter = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/upload', uploadMulter.single('file'), fileController.upload);

module.exports = router;
