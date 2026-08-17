import mongoose from "mongoose";

const pairingCodeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  code:   { type: String, required: true, index: true },
  expiresAt: { type: Date, required: true },
});

pairingCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PairingCode = mongoose.model("PairingCode", pairingCodeSchema);
export default PairingCode;