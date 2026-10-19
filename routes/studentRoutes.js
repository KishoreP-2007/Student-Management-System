const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const dataFile = path.join(
    __dirname,
    "..",
    "data",
    "students.json"
);

// Read students
function readStudents() {

    const data = fs.readFileSync(dataFile, "utf8");

    return JSON.parse(data);

}

// Write students
function writeStudents(students) {

    fs.writeFileSync(
        dataFile,
        JSON.stringify(students, null, 2)
    );

}

// GET all students
router.get("/", (req, res) => {

    try {

        const students = readStudents();

        res.json(students);

    } catch (error) {

        res.status(500).json({
            message: "Unable to read students"
        });

    }

});

// GET student by ID
router.get("/:id", (req, res) => {

    try {

        const students = readStudents();

        const id = Number(req.params.id);

        const student = students.find(
            student => student.id === id
        );

        if (!student) {

            return res.status(404).json({
                message: "Student not found"
            });

        }

        res.json(student);

    } catch (error) {

        res.status(500).json({
            message: "Server error"
        });

    }

});

// POST new student
router.post("/", (req, res) => {

    try {

        const students = readStudents();

        const { name, department, year, email } = req.body;

        if (!name || !department || !year || !email) {

            return res.status(400).json({
                message: "All fields are required"
            });

        }

        const newId =
            students.length > 0
                ? Math.max(...students.map(s => s.id)) + 1
                : 1;

        const newStudent = {

            id: newId,

            name: name,

            department: department,

            year: Number(year),

            email: email

        };

        students.push(newStudent);

        writeStudents(students);

        res.status(201).json(newStudent);

    } catch (error) {

        res.status(500).json({
            message: "Unable to add student"
        });

    }

});

// PUT update student
router.put("/:id", (req, res) => {

    try {

        const students = readStudents();

        const id = Number(req.params.id);

        const index = students.findIndex(
            student => student.id === id
        );

        if (index === -1) {

            return res.status(404).json({
                message: "Student not found"
            });

        }

        const updatedStudent = {

            id: id,

            name: req.body.name,

            department: req.body.department,

            year: Number(req.body.year),

            email: req.body.email

        };

        students[index] = updatedStudent;

        writeStudents(students);

        res.json(updatedStudent);

    } catch (error) {

        res.status(500).json({
            message: "Unable to update student"
        });

    }

});

// DELETE student
router.delete("/:id", (req, res) => {

    try {

        const students = readStudents();

        const id = Number(req.params.id);

        const filteredStudents = students.filter(
            student => student.id !== id
        );

        if (filteredStudents.length === students.length) {

            return res.status(404).json({
                message: "Student not found"
            });

        }

        writeStudents(filteredStudents);

        res.json({
            message: "Student deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Unable to delete student"
        });

    }

});

module.exports = router;