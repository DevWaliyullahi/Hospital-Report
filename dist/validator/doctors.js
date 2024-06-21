"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDoctorValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createDoctorValidation = joi_1.default.object({
    doctorsName: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    specializations: joi_1.default.string().required(),
    gender: joi_1.default.string().required(),
    phoneNumber: joi_1.default.string().required(),
    password: joi_1.default.string().min(6).required(),
    isAdmin: joi_1.default.boolean(),
});
