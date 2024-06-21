import express from 'express';
import { loginDoctor } from '../controller/doctors';
// import { isAdmin } from '../middleware/authentication';

const router = express.Router();


// login Doctor and Admin
router.post("/login", loginDoctor, async (req, res) => {
    if ((req.session as any).isAdmin === true) {
      return res.redirect("/admin/dashboard");
    } else {
      return res.redirect("/doctor/dashboard");
    }
  });
  
  router.get("/logout", (req, res, next) => {
    req.session.destroy((err) => {
      if (err) {
        const err = new Error("Internal Server Error");
        return next(err);
      } else {
        console.log("did you see me");
        res.redirect("/");
      }
    });
  });
  




export default router;
