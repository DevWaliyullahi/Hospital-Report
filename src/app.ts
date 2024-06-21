import 'dotenv/config'
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import session from 'express-session';
// import dotenv from 'dotenv';
// dotenv.config();



import indexRouter from './routes/index';
import doctorsRouter from './routes/doctors';
import reportsRouter from './routes/reports';
import adminRouter from './routes/admin'

const app = express();

//Connect to MongoDB
const database = process.env.DATABASE_URL as string;

mongoose.connect(database)
  .then(() => {
    console.log("Connected to MonogoDB Successfully...");
  }).catch((err) => {
    console.log("Error Connecting to MongoDB...");
    throw err;
});



// view engine setup
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../', 'public')));

// Session middleware
app.use(session({
  secret: process.env.secret as string,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store must-revalidate');
  next();
});

app.use('/', indexRouter);
app.use('/doctors', doctorsRouter);
app.use('/reports', reportsRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // Log the error to the console for debugging purposes
  console.error(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
