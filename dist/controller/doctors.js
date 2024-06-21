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
exports.getDoctorDetails = exports.getAllDoctors = exports.deleteDoctor = exports.updateDoctor = exports.loginDoctor = exports.createDoctor = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const doctors_1 = __importDefault(require("../model/doctors"));
const authentication_1 = require("../middleware/authentication");
const doctors_2 = require("../validator/doctors");
// Create a new doctor
// Create a new doctor
const createDoctor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request payload
        const { error } = doctors_2.createDoctorValidation.validate(req.body);
        if (error) {
            const errorMessage = error.details[0].message;
            return res.redirect(`/admin/dashboard?error=${encodeURIComponent(errorMessage)}`);
        }
        const { doctorsName, email, specializations, gender, phoneNumber, password, isAdmin } = req.body;
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create a new doctor
        const newDoctor = new doctors_1.default({
            doctorsName,
            email,
            specializations,
            gender,
            phoneNumber,
            password: hashedPassword,
            isAdmin,
        });
        yield newDoctor.save();
        res.redirect('/admin/dashboard');
    }
    catch (error) {
        if (error.name === 'MongoServerError' && error.code === 11000) {
            // Duplicate key error (email or phoneNumber already exists)
            let duplicateField;
            if (error.keyPattern.email) {
                duplicateField = 'email';
            }
            else if (error.keyPattern.phoneNumber) {
                duplicateField = 'phoneNumber';
            }
            const errorMessage = `Duplicate key error: ${duplicateField} already exists`;
            return res.redirect(`/admin/dashboard?error=${encodeURIComponent(errorMessage)}`);
        }
        console.error("Error creating doctor", error);
        res.redirect('/admin/dashboard?error=Internal Server Error');
    }
});
exports.createDoctor = createDoctor;
// Login a registered doctor and admin using authentication
const loginDoctor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ message: "Email or password missing" });
    }
    try {
        // Check if doctor is registered
        const doctor = yield doctors_1.default.findOne({ email });
        if (!doctor) {
            return res.status(400).json({ error: 'Invalid email' });
        }
        // Validate password
        const validPassword = yield bcrypt_1.default.compare(password, doctor.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid password' });
        }
        // Create and assign a token
        const accessToken = (0, authentication_1.generateAccessToken)(doctor);
        const doctorId = doctor.id;
        const doctorsName = doctor.doctorsName;
        console.log("Doctor", doctor);
        const isAdmin = doctor.isAdmin;
        req.session.token = accessToken;
        req.session.doctorId = doctorId;
        req.session.doctorsName = doctorsName;
        req.session.isAdmin = isAdmin;
        console.log("Session after Login", req.session);
        next();
    }
    catch (error) {
        console.error("Error logging in doctor:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.loginDoctor = loginDoctor;
// Update a doctor
const updateDoctor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctorId = req.params.id;
        const updates = req.body;
        const options = { new: true };
        const doctor = yield doctors_1.default.findByIdAndUpdate(doctorId, updates, options);
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor does not exist' });
        }
        res.status(200).json({ message: 'Doctor updated successfully', doctor });
    }
    catch (error) {
        console.error("Error updating doctor", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateDoctor = updateDoctor;
// Delete a doctor
const deleteDoctor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctorId = req.params.id;
        const doctor = yield doctors_1.default.findByIdAndDelete(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor does not exist' });
        }
        res.status(200).json({ message: 'Doctor deleted successfully', doctor });
    }
    catch (error) {
        console.error("Error updating doctor", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.deleteDoctor = deleteDoctor;
// Get all doctors with pagination
const getAllDoctors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5; // Adjust the limit as needed
        const skip = (page - 1) * limit;
        const doctors = yield doctors_1.default.find({ isAdmin: false }).skip(skip).limit(limit);
        const totalDoctors = yield doctors_1.default.countDocuments({ isAdmin: false });
        res.status(200).json({
            message: "Doctors Successfully retrieved",
            doctors,
            currentPage: page,
            totalPages: Math.ceil(totalDoctors / limit),
        });
    }
    catch (error) {
        console.error("Error getting doctors", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getAllDoctors = getAllDoctors;
// Get a single doctor
const getDoctorDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctorId = req.params.id;
        const doctor = yield doctors_1.default.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor does not exist' });
        }
        res.status(200).json(doctor);
    }
    catch (error) {
        console.error("Error getting doctor", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getDoctorDetails = getDoctorDetails;
