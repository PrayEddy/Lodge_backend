import mongoose, { Schema } from 'mongoose';
import { RoomDocument } from '../types/types';

const roomSchema: Schema = new Schema({
  roomNumber: { type: Number, required: true, unique: true },
  isOccupied: { type: Boolean, default: false },
  price: { type: Number, required: true },
  occupantName: { type: String },
  checkInDate: { type: Date },
  checkOutDate: { type: Date }
});

const Room = mongoose.model<RoomDocument>('Room', roomSchema);

export default Room;
