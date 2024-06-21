"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../middleware/authentication");
const router = express_1.default.Router();
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});
// get login page
router.get('/login', function (req, res, next) {
    res.render('login', { title: 'Login' });
});
router.get('/doctor/signup', function (req, res, next) {
    res.render('register', { title: 'Register' });
});
router.get('/doctor/dashboard', authentication_1.authenticateToken, function (req, res, next) {
    const doctorsName = req.session.doctorsName;
    res.render('dashboard', { doctorsName });
});
router.get('/admin/dashboard', authentication_1.authenticateToken, function (req, res, next) {
    const doctorsName = req.session.doctorsName;
    res.render('admin', { doctorsName });
});
exports.default = router;
