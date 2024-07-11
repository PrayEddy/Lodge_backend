import mongoose, { Schema } from 'mongoose';
import { RoomDocument } from '../types/types';

const roomSchema: Schema<RoomDocument> = new Schema({
  roomNumber: { type: Number, required: true, unique: true },
  isOccupied: { type: Boolean, default: false },
  price: { type: Number, required: true },
  occupantName: { type: String, default: null }, 
  checkInDate: { type: Date, default: null },    
  checkOutDate: { type: Date, default: null }    
}, {
  timestamps: true  // Optional: if you want to automatically add createdAt and updatedAt timestamps
});

const Room = mongoose.model<RoomDocument>('Room', roomSchema);

export default Room;

