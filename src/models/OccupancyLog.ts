import mongoose, { Schema } from 'mongoose';
import { OccupancyLogDocument } from "../types/types";

const occupancyLogSchema: Schema = new Schema({
    roomNumber: { type: String, required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    price: { type: Number, required: true }
  });
  
  const OccupancyLog = mongoose.model<OccupancyLogDocument>('OccupancyLog', occupancyLogSchema);
  
export default OccupancyLog;