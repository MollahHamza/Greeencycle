const express = require("express");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allow frontend to communicate
app.use(express.json()); // Parse JSON data
app.use("/images", express.static(path.join(__dirname, "images"))); // Serve images

// Configure Multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images/"); // Save images in 'images/' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});
const upload = multer({ storage });

const reportsFilePath = path.join(__dirname, "reports.json");

// Load existing reports
const loadReports = () => {
    if (!fs.existsSync(reportsFilePath)) {
        fs.writeFileSync(reportsFilePath, "[]"); // Initialize file if missing
    }
    return JSON.parse(fs.readFileSync(reportsFilePath));
};

// Save reports to file
const saveReports = (reports) => {
    fs.writeFileSync(reportsFilePath, JSON.stringify(reports, null, 2));
};

// Handle waste report submission
app.post("/submit-report", upload.single("image"), (req, res) => {
    const { wasteType, location, description, latitude, longitude } = req.body;
    if (!wasteType || !location || !description || !latitude || !longitude) {
        return res.status(400).json({ error: "All fields including location are required" });
    }

    let imageUrl = null;
    if (req.file) {
        imageUrl = `http://localhost:${PORT}/images/${req.file.filename}`;
    }

    const newReport = {
        id: Date.now(),
        wasteType,
        location,
        description,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        imageUrl,
        date: new Date().toISOString()
    };

    const reports = loadReports();
    reports.push(newReport);
    saveReports(reports);

    res.json({ message: "Report submitted successfully", report: newReport });
});

// Get all reports
app.get("/reports", (req, res) => {
    const reports = loadReports();
    res.json(reports);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
