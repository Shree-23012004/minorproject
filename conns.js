const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Add cors for cross-origin requests
const bodyParser = require('body-parser');
const multer = require('multer'); // For handling file uploads
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded images

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/complaintDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Complaint Schema
const complaintSchema = new mongoose.Schema({
    uploaderName: String,
    address: String,
    city: String,
    pincode: String,
    area: String,
    contact: String,
    email: String,
    description: String,
    imageUrl: String,
    status: {
        type: String,
        default: 'Pending'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Complaint Model
const Complaint = mongoose.model('Complaint', complaintSchema);

// File Upload Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Files will be saved in the 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) // Unique filename
    }
});

const upload = multer({ storage: storage });

// Route to add a new complaint
app.post('/addComplaint', upload.single('complaintImage'), async (req, res) => {
    try {
        const newComplaint = new Complaint({
            uploaderName: req.body.uploaderName,
            address: req.body.address,
            city: req.body.city || '', // Optional
            pincode: req.body.pincode || '', // Optional
            area: req.body.area || '', // Optional
            contact: req.body.contact,
            email: req.body.email,
            description: req.body.description,
            imageUrl: req.file ? `/uploads/${req.file.filename}` : '',
            status: 'Pending'
        });

        await newComplaint.save();
        res.status(201).json(newComplaint);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to get all complaints
app.get('/getComplaints', async (req, res) => {
    try {
        const complaints = await Complaint.find();
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});