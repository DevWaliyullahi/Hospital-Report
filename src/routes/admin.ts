import express from 'express';
import { createDoctor, getAllDoctors, getDoctorDetails, updateDoctor, deleteDoctor  } from '../controller/doctors';

const router = express.Router();

router.post('/reg', createDoctor);
router.get('/doctors',  getAllDoctors);
router.get('/doctors/:id', getDoctorDetails);
router.put('/doctors/:id', updateDoctor);
router.delete('/doctors/:id', deleteDoctor);


export default router;