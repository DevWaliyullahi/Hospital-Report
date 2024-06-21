import mongoose, { Schema, Document } from "mongoose";

interface ReportsInterface extends Document {
    patientId: string;
    patientName: string;
    age: string;
    hospitalName: string;
    weight: string;
    height: string;
    bloodGroup: string;
    genotype: string;
    bloodPressure: string;
    HIV_status: string;
    hepatitis: string;
    timestamp: boolean;
}

const ReportSchema = new Schema({
    patientId: {
        type: String,
        required: true,
    },
    patientName: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true,
    },
    hospitalName: {
        type: String,
        required: true,
    },
    weight: {
        type: String,
        required: true,
    },
    height: {
        type: String,
        required: true,
    },
    bloodGroup: {
        type: String,
        required: true,
    },
    genotype: {
        type: String,
        required: true,
    },
    bloodPressure: {
        type: String,
        required: true,
    },
    HIV_status: {
        type: String,
        required: true,
    },
    hepatitis: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Reports = mongoose.model<ReportsInterface>("Reports", ReportSchema);

export default Reports;
