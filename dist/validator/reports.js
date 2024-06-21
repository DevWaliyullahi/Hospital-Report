"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReportValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createReportValidation = joi_1.default.object({
    patientId: joi_1.default.string().required(),
    patientName: joi_1.default.string().required(),
    age: joi_1.default.string().required(),
    hospitalName: joi_1.default.string().required(),
    weight: joi_1.default.string().required(),
    height: joi_1.default.string().required(),
    bloodGroup: joi_1.default.string().required(),
    genotype: joi_1.default.string().required(),
    bloodPressure: joi_1.default.string().required(),
    HIV_status: joi_1.default.string().required(),
    hepatitis: joi_1.default.string().required(),
});
