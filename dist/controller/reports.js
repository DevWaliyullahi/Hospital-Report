"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDoctorReports = exports.deleteDoctorReport = exports.updateDoctorReport = exports.deleteReport = exports.updateReport = exports.getDoctorReportDetails = exports.getReportDetails = exports.getAllDetails = exports.createReport = void 0;
const reports_1 = __importDefault(require("../model/reports"));
const reports_2 = require("../validator/reports");
const createReport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request payload
        const { error } = reports_2.createReportValidation.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const { patientId, patientName, age, hospitalName, weight, height, bloodGroup, genotype, bloodPressure, HIV_status, hepatitis, } = req.body;
        // console.log(req.body);
        // Create a new report
        const newReport = new reports_1.default({
            patientId,
            patientName,
            age,
            hospitalName,
            weight,
            height,
            bloodGroup,
            genotype,
            bloodPressure,
            HIV_status,
            hepatitis,
        });
        // console.log(newReport);
        yield newReport.save();
        // console.log(newReport);
        // res.redirect("/doctor/dashboard");
        res.status(201).json({ message: "Report created successfully" });
    }
    catch (error) {
        console.error("Error creating report", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.createReport = createReport;
// Get all reports
// Get all reports with pagination
const getAllDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1 if page parameter is not provided
        const perPage = 5; // Number of reports per page
        const totalReports = yield reports_1.default.countDocuments();
        const totalPages = Math.ceil(totalReports / perPage);
        const reports = yield reports_1.default.find()
            .skip((page - 1) * perPage)
            .limit(perPage);
        res.status(200).json({ message: "Reports Retrieved Successfully", reports, totalPages });
    }
    catch (error) {
        console.error("Error getting report", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getAllDetails = getAllDetails;
// Get a single report
const getReportDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reportId = req.params.id;
    try {
        const report = yield reports_1.default.findById(reportId);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }
        res.status(200).json(report);
    }
    catch (error) {
        console.error("Error getting report:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getReportDetails = getReportDetails;
// Get a single Doctor report
const getDoctorReportDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const doctorId = req.session.doctorId;
    const reportId = req.params.id;
    try {
        const report = yield reports_1.default.findOne({ _id: reportId, doctorId });
        if (!report) {
            return res.status(404).json({ message: "Report not found or unauthorized" });
        }
        res.status(200).json(report);
    }
    catch (error) {
        console.error("Error getting doctor's report:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getDoctorReportDetails = getDoctorReportDetails;
// Update a report
const updateReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reportId = req.params.id;
    const updates = req.body;
    try {
        const report = yield reports_1.default.findByIdAndUpdate(reportId, updates, { new: true });
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }
        res.status(200).json({ message: "Report Updated Successfully", report });
    }
    catch (error) {
        console.error("Error updating report:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateReport = updateReport;
// Delete a report
const deleteReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reportId = req.params.id;
    try {
        const report = yield reports_1.default.findByIdAndDelete(reportId);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }
        res.status(200).json({ message: "Report Deleted Successfully" });
    }
    catch (error) {
        console.error("Error deleting report:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.deleteReport = deleteReport;
// Update a report
const updateDoctorReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const doctorId = req.session.doctorId;
    const reportId = req.params.id;
    const updates = req.body;
    try {
        const report = yield reports_1.default.findOneAndUpdate({ _id: reportId, doctorId }, updates, { new: true });
        if (!report) {
            return res.status(404).json({ message: "Report not found or unauthorized" });
        }
        res.status(200).json({ message: "Report Updated Successfully", report });
    }
    catch (error) {
        console.error("Error updating doctor's report:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateDoctorReport = updateDoctorReport;
// Delete a report
const deleteDoctorReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const doctorId = req.session.doctorId;
    const reportId = req.params.id;
    try {
        const report = yield reports_1.default.findOneAndDelete({ _id: reportId, doctorId });
        if (!report) {
            return res.status(404).json({ message: "Report not found or unauthorized" });
        }
        res.status(200).json({ message: "Report Deleted Successfully" });
    }
    catch (error) {
        console.error("Error deleting doctor's report:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.deleteDoctorReport = deleteDoctorReport;
// Fetch reports created by the logged-in doctor
const getDoctorReports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctorId = req.session.doctorId;
        console.log(doctorId);
        if (!doctorId) {
            return res
                .status(401)
                .json({ message: "Unauthorized: Doctor not logged in" });
        }
        const report = yield reports_1.default.find({ doctorId });
        console.log("Reports", report);
        res.status(200).json({ message: "Reports Retrieved Successfully", report });
    }
    catch (error) {
        console.error("Error getting doctor's reports:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getDoctorReports = getDoctorReports;
// Other Report controller methods (delete, update, fetch) similar to the previous example
