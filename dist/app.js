"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
// import dotenv from 'dotenv';
// dotenv.config();
const index_1 = __importDefault(require("./routes/index"));
const doctors_1 = __importDefault(require("./routes/doctors"));
const reports_1 = __importDefault(require("./routes/reports"));
const admin_1 = __importDefault(require("./routes/admin"));
const app = (0, express_1.default)();
//Connect to MongoDB
const database = process.env.DATABASE_URL;
mongoose_1.default.connect(database)
    .then(() => {
    console.log("Connected to MonogoDB Successfully...");
}).catch((err) => {
    console.log("Error Connecting to MongoDB...");
    throw err;
});
// view engine setup
app.set('views', path_1.default.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, '../', 'public')));
// Session middleware
app.use((0, express_session_1.default)({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store must-revalidate');
    next();
});
app.use('/', index_1.default);
app.use('/doctors', doctors_1.default);
app.use('/reports', reports_1.default);
app.use('/admin', admin_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use(function (err, req, res, next) {
    // Log the error to the console for debugging purposes
    console.error(err);
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
exports.default = app;
