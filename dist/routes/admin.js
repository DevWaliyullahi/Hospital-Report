"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const doctors_1 = require("../controller/doctors");
const router = express_1.default.Router();
router.post('/reg', doctors_1.createDoctor);
router.get('/doctors', doctors_1.getAllDoctors);
router.get('/doctors/:id', doctors_1.getDoctorDetails);
router.put('/doctors/:id', doctors_1.updateDoctor);
router.delete('/doctors/:id', doctors_1.deleteDoctor);
exports.default = router;
