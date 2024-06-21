import mongoose from "mongoose";

const Schema = mongoose.Schema;

interface DoctorsInterface {
    doctorsName: string;
    email: string;
    specializations: string;
    gender: string;
    phoneNumber: string;
    password: string;
    isAdmin: boolean;
    // dueDate: { type: String, default: () => moment().format('DD/MM/YYYY') };
    timestamps: boolean;
}

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

const Doctors = mongoose.model<DoctorsInterface>("Doctors", DoctorSchema);

export default Doctors;

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

