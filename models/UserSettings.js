import mongoose from "mongoose";

const userSettingsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    defaultTone: { type: String, default: "professional" },
    defaultLanguage: { type: String, default: "English" },
    includeHashtags: { type: Boolean, default: true },
    includeEmoji: { type: Boolean, default: false },
    autoGenerate: { type: Boolean, default: false },
    autoPublish: { type: Boolean, default: false },
    preferredPlatforms: { type: [String], default: ["LINKEDIN"] },
  },
  { timestamps: true }
);

export default mongoose.models.UserSettings || mongoose.model("UserSettings", userSettingsSchema);
