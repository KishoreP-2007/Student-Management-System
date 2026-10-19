const express = require("express");
const path = require("path");

const studentRoutes = require("./routes/studentRoutes");

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

app.use(express.static(
    path.join(__dirname, "public")
));

// Student API routes
app.use("/students", studentRoutes);

// Health check
app.get("/health", (req, res) => {

    res.json({
        status: "OK",
        application: "Student Management System"
    });

});

// Root
app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );

});

// Handle unknown routes
app.use((req, res) => {

    res.status(404).json({
        message: "Route not found"
    });

});

// Start server
app.listen(PORT, () => {

    console.log(
        `Student Management Server running on port ${PORT}`
    );

});