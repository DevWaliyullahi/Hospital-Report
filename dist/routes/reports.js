"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reports_1 = require("../controller/reports");
const router = express_1.default.Router();
// router.post('/create', createReport);
router.post("/report", reports_1.createReport);
router.get("/reports", reports_1.getAllDetails);
router.get("/reports/:id", reports_1.getReportDetails);
router.put("/reports/:id", reports_1.updateReport);
router.delete("/reports/:id", reports_1.deleteReport);
exports.default = router;
