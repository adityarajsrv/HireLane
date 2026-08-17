import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email:   { type: String, required: true, lowercase: true, index: true },
  codeHash:{ type: String, required: true },
  purpose: { type: String, enum: ["verify_email", "reset_password"], required: true },
  expiresAt: { type: Date, required: true },
});

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Otp = mongoose.model("Otp", otpSchema);
export default Otp;