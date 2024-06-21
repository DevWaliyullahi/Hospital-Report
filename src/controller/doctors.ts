// src/controllers/doctorController.ts
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import Doctor from '../model/doctors';
import { generateAccessToken, authenticateToken, } from '../middleware/authentication';
import { createDoctorValidation } from '../validator/doctors';

// Create a new doctor
// Create a new doctor
export const createDoctor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request payload
    const { error } = createDoctorValidation.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message;
      return res.redirect(`/admin/dashboard?error=${encodeURIComponent(errorMessage)}`);
    }

    const { doctorsName, email, specializations, gender, phoneNumber, password, isAdmin } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new doctor
    const newDoctor = new Doctor({
      doctorsName,
      email,
      specializations,
      gender,
      phoneNumber,
      password: hashedPassword,
      isAdmin,
    });

    await newDoctor.save();

    res.redirect('/admin/dashboard');
  } catch (error) {
    if ((error as any).name === 'MongoServerError' && (error as any).code === 11000) {
      // Duplicate key error (email or phoneNumber already exists)
      let duplicateField;
      if ((error as any).keyPattern.email) {
        duplicateField = 'email';
      } else if ((error as any).keyPattern.phoneNumber) {
        duplicateField = 'phoneNumber';
      }

      const errorMessage = `Duplicate key error: ${duplicateField} already exists`;
      return res.redirect(`/admin/dashboard?error=${encodeURIComponent(errorMessage)}`);
    }

    console.error("Error creating doctor", error);
    res.redirect('/admin/dashboard?error=Internal Server Error');
  }
};

// Login a registered doctor and admin using authentication
export const loginDoctor = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({message: "Email or password missing"})
  }
  try {
    // Check if doctor is registered
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, doctor.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Create and assign a token
    const accessToken = generateAccessToken(doctor);
    const doctorId = doctor.id;
    const doctorsName = doctor.doctorsName;
    console.log("Doctor", doctor);
    
    const isAdmin = doctor.isAdmin;

    (req.session as any).token = accessToken;
    (req.session as any).doctorId = doctorId;
    (req.session as any).doctorsName = doctorsName;
    (req.session as any).isAdmin = isAdmin;

    console.log("Session after Login", req.session);
    
    next();
  }catch (error) {
    console.error("Error logging in doctor:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update a doctor
export const updateDoctor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doctorId = req.params.id;
    const updates = req.body;
    const options = { new: true };

    const doctor = await Doctor.findByIdAndUpdate(doctorId, updates, options);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor does not exist' });
    }

    res.status(200).json({ message: 'Doctor updated successfully', doctor });
  } catch (error) {
    console.error("Error updating doctor", error);
    res.status(500).json({message: "Internal Server Error"});
  }
};

// Delete a doctor
export const deleteDoctor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doctorId = req.params.id;
    const doctor = await Doctor.findByIdAndDelete(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor does not exist' });
    }

    res.status(200).json({ message: 'Doctor deleted successfully', doctor });
  } catch (error) {
    console.error("Error updating doctor", error);
    res.status(500).json({message: "Internal Server Error"});
  }
};

// Get all doctors with pagination
export const getAllDoctors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5; // Adjust the limit as needed

    const skip = (page - 1) * limit;

    const doctors = await Doctor.find({ isAdmin: false }).skip(skip).limit(limit);
    const totalDoctors = await Doctor.countDocuments({ isAdmin: false });

    res.status(200).json({
      message: "Doctors Successfully retrieved",
      doctors,
      currentPage: page,
      totalPages: Math.ceil(totalDoctors / limit),
    });
  } catch (error) {
    console.error("Error getting doctors", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get a single doctor
export const getDoctorDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doctorId = req.params.id;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor does not exist' });
    }

    res.status(200).json(doctor);
  } catch (error) {
    console.error("Error getting doctor", error);
    res.status(500).json({message: "Internal Server Error"});
  }
};





