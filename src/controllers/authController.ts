require('dotenv').config();
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { UserDocument } from '../types/types';

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();
    res.status(201).send('User created successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }) as UserDocument;
    if (!user) {
      return res.status(404).send('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }
    // Include additional details in the JWT
    const tokenPayload = {
      id: user._id,
      username: user.username,
      role: user.role
    };
    
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    const response = {
      message: 'Logged in successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Login error', error });
  }
};

