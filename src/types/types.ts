import { Document } from 'mongoose';

export interface RoomDocument extends Document {
  roomNumber: number;
  isOccupied: boolean;
  price: number;
  occupantName?: string;
  checkInDate?: Date;
  checkOutDate?: Date;
}

export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
}
