import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, select: false },
    avatarUrl: { type: String, trim: true },
    githubId: { type: String, unique: true, sparse: true, index: true },
    username: { type: String, trim: true },
    timezone: { type: String, default: "UTC" },
    plan: { type: String, enum: ["FREE", "PRO"], default: "FREE" },
    emailVerified: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
