import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserDocument } from '../types/types';

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer Token
  if (!token) {
      return res.status(401).json({ message: 'No token provided' });
  }

  if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
  }

  try {

      const decoded = jwt.verify(token, process.env.JWT_SECRET) as UserDocument;
      req.user = decoded;
      next();
  } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
  }
};

export default isAuthenticated