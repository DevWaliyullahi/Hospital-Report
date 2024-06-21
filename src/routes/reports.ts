
import express from 'express';
import { createReport, getAllDetails, updateDoctorReport, deleteDoctorReport, getDoctorReportDetails, getReportDetails, updateReport, deleteReport } from "../controller/reports";

const router = express.Router();

// router.post('/create', createReport);
router.post("/report", createReport);
router.get("/reports", getAllDetails);
router.get("/reports/:id", getReportDetails);
router.put("/reports/:id", updateReport);
router.delete("/reports/:id", deleteReport);

export default router;
