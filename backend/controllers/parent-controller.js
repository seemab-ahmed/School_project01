const bcrypt = require('bcrypt');
const Parent = require('../models/parentSchema.js');
const Student = require('../models/studentSchema.js');
const os = require("os");
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const parentRegister = async (req, res) => {

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const existingParent = await Parent.findOne({ email: req.body.email });
        if (existingParent) {
            return res.send({ message: 'Email already registered' });
        }
        const parent = new Parent({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.contactNumber, // Map contactNumber to phone
            password: hashedPass,
            adminID: req.body.adminID, // Include adminID
            role: req.body.role || "Parent" // Default to "Parent" if not provided
        });
        let result = await parent.save();
        result.password = undefined;
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

const parentLogIn = async (req, res) => {
    try {
        let parent = await Parent.findOne({ email: req.body.email });
        if (parent) {
            const validated = await bcrypt.compare(req.body.password, parent.password);
            if (validated) {
                parent.password = undefined;
                res.send(parent);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "Parent not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getStudentsByParent = async (req, res) => {
    try {
        const students = await Student.find({ parent: req.params.id }).populate("sclassName", "sclassName");
        res.send(students);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getAllParents = async (req, res) => {
    try {
        const parents = await Parent.find();
        res.send(parents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
            .populate("school", "schoolName")
            .populate("sclassName", "sclassName");
        if (student) {
            res.send(student);
        } else {
            res.send({ message: "Student not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getStudentMarks = async (req, res) => {
    try {
        const student = await Student.findOne({ rollNum: req.params.rollNum })
            .populate("examResult.subName", "subName marksObtained");

        if (student) {
            res.send(student);
        } else {
            res.status(404).json({ message: "Student not found" });
        }
    } catch (err) {
        res.status(500).json({ error: "Internal server error", details: err });
    }
};

const downloadStudentResult = async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId)
            .populate("examResult.subName", "subName marksObtained");

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Get the user's Downloads directory
        const downloadsDir = path.join(os.homedir(), "Downloads");
        const filePath = path.join(downloadsDir, `${student.name}_${student.rollNum}.pdf`);

        // Create a PDF document
        const doc = new PDFDocument({ margin: 50 });

        // Pipe the PDF to a file
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Title
        doc.fontSize(22).font("Helvetica-Bold").text("Student Report Card", { align: "center" });
        doc.moveDown(2);

        // Student Info
        doc.fontSize(16).font("Helvetica-Bold").text(`Name: `, { continued: true })
            .font("Helvetica").text(student.name);
        doc.fontSize(16).font("Helvetica-Bold").text(`Roll Number: `, { continued: true })
            .font("Helvetica").text(student.rollNum.toString());
        doc.moveDown();

        // Draw a line separator
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        // Exam Results Table Header
        doc.fontSize(16).font("Helvetica-Bold").text("Subject", 100, doc.y);
        doc.text("Marks Obtained", 350, doc.y);
        doc.moveDown();
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        // Exam Results Data
        student.examResult.forEach(result => {
            doc.fontSize(14).font("Helvetica").text(result.subName.subName, 100, doc.y);
            doc.text(result.marksObtained.toString(), 350, doc.y);
            doc.moveDown(0.5);
        });

        // End & Save the document
        doc.end();

        stream.on("finish", () => {
            res.download(filePath, `${student.name}_${student.rollNum}.pdf`, (err) => {
                if (err) console.log(err);
                // Optionally delete after download
                // fs.unlinkSync(filePath);
            });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

const updateParent = async (req, res) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        let result = await Parent.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        result.password = undefined;
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    parentRegister,
    parentLogIn,
    getStudentsByParent,
    getStudentProfile,
    getStudentMarks,
    downloadStudentResult,
    updateParent,
    getAllParents,
};
