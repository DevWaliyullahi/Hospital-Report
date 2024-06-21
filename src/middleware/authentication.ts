import 'dotenv/config'
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Session } from 'express-session';


interface AccessTokenPayload extends jwt.JwtPayload {
  email: string;
  id: string;
}

export function generateAccessToken(user: any) {
  const payload = {
    email: user.email,
    id: user.id,
  };
  const secret = process.env.secret || "default_secret";

  const options = { expiresIn: "1h" };

  return jwt.sign(payload, secret, options);
}


function verifyAccessToken(token: string) {
  const secret: string = process.env.secret || "default_secret";

  try {
    const decoded = jwt.verify(token, secret) as AccessTokenPayload;
    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, data: (error as Error).message };
  }
}

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  

  const token = (req.session as any).token;
  const userId = (req.session as any).userId;

  if (!token) {
    res.redirect("/login");
  }

  const verification = verifyAccessToken(token);
  if (!verification.success) {
    res.redirect("/login");
  }
  next();
}
