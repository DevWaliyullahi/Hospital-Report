"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const DoctorSchema = new Schema({
    doctorsName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // this means that the email must be unique
    },
    specializations: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true, // this means that the phone number must be unique
    },
    password: {
        type: String,
        required: true,
        minLength: 6, // this means that the password must be at least 6 characters long
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true
});
const Doctors = mongoose_1.default.model("Doctors", DoctorSchema);
exports.default = Doctors;
// embed doctor and patient
// const patientSchema = new mongoose.Schema({
//   name: String,
//   age: Number,
//   diagnosis: String,
// });
// const doctorSchema = new mongoose.Schema({
//   name: String,
//   specializations: String,
//   patients: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Patient',
//   }],
// });
// // Create models for Doctor and Patient
// const Doctor = mongoose.model('Doctor', doctorSchema);
// const Patient = mongoose.model('Patient', patientSchema);
