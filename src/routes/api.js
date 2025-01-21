const express = require('express');
const multer = require('multer');
const router = express.Router();

// Set up the storage destination and file naming convention for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Define where to store the uploaded files
        cb(null, 'uploads/'); // Files will be saved in the "uploads" folder
    },
    filename: (req, file, cb) => {
        // Use the original file name
        cb(null, Date.now() + '-' + file.originalname); // Add timestamp to avoid overwriting
    }
});

// Initialize Multer with the storage configuration
const upload = multer({ storage: storage });

// Simple GET route to check the API
router.get('/', (req, res) => {
    res.send({ message: 'Welcome to the AWS Node.js Project!' });
});

// POST route for file uploads
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded.' });
    }
    res.send({
        message: 'File uploaded successfully!',
        file: req.file // Send back the file info (e.g., filename, path)
    });
});

module.exports = router;