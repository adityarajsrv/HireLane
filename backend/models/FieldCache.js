import mongoose from 'mongoose';

const fieldCacheSchema = new mongoose.Schema({
    signature: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    ats: {
        type: String,
        required: true,
        enum: ["workday", "greenhouse", "lever", "internshala", "naukri", "unknown"],
    },
    label: {
        type: String,
        required: true,
    },
    profileKey: {
        type: String,
        required: true,
        enum: [
            "firstName", "lastName", "email", "phone",
            "linkedin", "github", "portfolio", "location",
            "workAuth", "expectedSalary", "noticePeriod",
            "coverLetter", "unknown",
        ],
    },
    confidence: {
        type: Number,
        default: 1.0,
        min: 0,
        max: 1.0,
    },
    hitCount: {
        type: Number,
        default: 0,
    },
},
    { timestamps: true }
);

fieldCacheSchema.index({ ats: 1, signature: 1 });


const FieldCache = mongoose.model('FieldCache', fieldCacheSchema);

export default FieldCache;
