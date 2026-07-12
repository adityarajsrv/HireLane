import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true,
        index: true
    },
    firstName: { type: String, trim: true, default: "" },
    lastName: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    linkedin: { type: String, trim: true, default: "" },
    github: { type: String, trim: true, default: "" },
    portfolio: { type: String, trim: true, default: "" },
    workAuth: {
        type: String,
        enum: ["citizen", "permanent_resident", "visa", "other", ""],
        default: "",
    },
    expectedSalary: { type: Number, default: 0 },
    noticePeriod: {
        type: String,
        enum: ["immediate", "15days", "30days", "60days", "90days", ""],
        default: "",
    },
    targetRoles: [{ type: String, trim: true }],
    resumeText: {
        type: String,
        default: "",
        select: false
    },
    cvBullets: [{ type: String}],
    skills: [{ type: String}],
    resumeFileName: { type: String, default: "" },
    resumeUploadedAt: { type: Date, default: null },
},{
    timestamps: true,
})

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;