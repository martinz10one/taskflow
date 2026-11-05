import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
}, { timestamps: true, versionKey: false });

export default mongoose.model('Usuario', usuarioSchema);