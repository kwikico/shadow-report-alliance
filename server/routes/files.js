const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain', 'text/csv', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and documents are allowed.'));
    }
  }
});

router.post('/', (req, res) => {
  upload.array('files')(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    const fileUrls = req.files.map(file => `http://localhost:5000/${file.filename}`);
    res.json({ fileUrls });
  });
});

module.exports = router;