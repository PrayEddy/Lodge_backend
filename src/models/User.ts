import mongoose, { Schema } from 'mongoose';
import { UserDocument } from '../types/types';

const userSchema: Schema = new Schema({
  username: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String},
  role: {type: String },
});

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;