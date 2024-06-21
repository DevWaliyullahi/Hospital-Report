import express from 'express';
import { authenticateToken } from '../middleware/authentication';


const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// get login page
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.get('/doctor/signup', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

router.get('/doctor/dashboard', authenticateToken, function(req, res, next) {
  const doctorsName = (req.session as any).doctorsName;

  res.render('dashboard', { doctorsName });
});

router.get('/admin/dashboard', authenticateToken, function(req, res, next) {
  const doctorsName = (req.session as any).doctorsName;

  res.render('admin', { doctorsName });
});


export default router;
