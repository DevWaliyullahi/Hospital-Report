import { Request, Response, NextFunction } from 'express';
import Report from '../model/reports';
import { createReportValidation } from '../validator/reports';

export const createReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request payload
    const { error } = createReportValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const {
      patientId,
      patientName,
      age,
      hospitalName,
      weight,
      height,
      bloodGroup,
      genotype,
      bloodPressure,
      HIV_status,
      hepatitis,
    } = req.body;

    // console.log(req.body);
    

    // Create a new report
    const newReport = new Report({
      patientId,
      patientName,
      age,
      hospitalName,
      weight,
      height,
      bloodGroup,
      genotype,
      bloodPressure,
      HIV_status,
      hepatitis,
    });

    // console.log(newReport);
    

    await newReport.save();

    // console.log(newReport);
    
    

    // res.redirect("/doctor/dashboard");
    res.status(201).json({ message: "Report created successfully" });

  } catch (error) {
    console.error("Error creating report", error);
    res.status(500).json({message: "Internal Server Error"});
  }
};


// Get all reports
// Get all reports with pagination
export const getAllDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1; // Default to page 1 if page parameter is not provided
    const perPage = 5; // Number of reports per page

    const totalReports = await Report.countDocuments();
    const totalPages = Math.ceil(totalReports / perPage);

    const reports = await Report.find()
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.status(200).json({ message: "Reports Retrieved Successfully", reports, totalPages });
  } catch (error) {
    console.error("Error getting report", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



// Get a single report

  export const getReportDetails = async (req: Request, res: Response) => {
    const reportId = req.params.id;

    try {
      const report = await Report.findById(reportId);

      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }

      res.status(200).json(report);
    } catch (error) {
      console.error("Error getting report:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  // Get a single Doctor report
  export const getDoctorReportDetails = async (req: Request, res: Response) => {
    const doctorId = (req.session as { doctorId?: string }).doctorId;

    const reportId = req.params.id;

    try {
      const report = await Report.findOne({ _id: reportId, doctorId });

      if (!report) {
        return res.status(404).json({ message: "Report not found or unauthorized" });
      }

      res.status(200).json(report);

    } catch (error) {
      console.error("Error getting doctor's report:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

// Update a report
export const updateReport = async (req: Request, res: Response) => {
  const reportId = req.params.id;
  const updates = req.body;

  try {
    const report = await Report.findByIdAndUpdate(reportId, updates, { new: true });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ message: "Report Updated Successfully", report });
  }catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete a report
export const deleteReport = async (req: Request, res: Response) => {
  const reportId = req.params.id;

  try {
    const report = await Report.findByIdAndDelete(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ message: "Report Deleted Successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Update a report
export const updateDoctorReport = async (req: Request, res: Response) => {
  const doctorId = (req.session as { doctorId?: string }).doctorId;
  const reportId = req.params.id;
  const updates = req.body;

  try {
    const report = await Report.findOneAndUpdate({ _id: reportId, doctorId }, updates, { new: true });

    if (!report) {
      return res.status(404).json({ message: "Report not found or unauthorized" });
    }

    res.status(200).json({ message: "Report Updated Successfully", report });
  } catch (error) {
    console.error("Error updating doctor's report:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Delete a report
export const deleteDoctorReport = async (req: Request, res: Response) => {
  const doctorId = (req.session as { doctorId?: string }).doctorId;
  const reportId = req.params.id;

  try {
    const report = await Report.findOneAndDelete({ _id: reportId, doctorId });

    if (!report) {
      return res.status(404).json({ message: "Report not found or unauthorized" });
    }

    res.status(200).json({ message: "Report Deleted Successfully" });
  } catch (error) {
    console.error("Error deleting doctor's report:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Fetch reports created by the logged-in doctor
export const getDoctorReports = async (req: Request, res: Response) => {
  try {
    const doctorId = (req.session as { doctorId?: string }).doctorId;
    console.log(doctorId);
    
    

    if (!doctorId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Doctor not logged in" });
    }

    const report = await Report.find({ doctorId });
    console.log("Reports", report);
    
    

    res.status(200).json({ message: "Reports Retrieved Successfully", report });
  } catch (error) {
    console.error("Error getting doctor's reports:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Other Report controller methods (delete, update, fetch) similar to the previous example
