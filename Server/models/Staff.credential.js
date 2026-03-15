const mongoose = require("mongoose");

const StaffSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, 
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        required: true,
        enum: ["Admin", "Host", "Security"],
        default: "Host"
    },
    dept: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true 
});

const StaffCredential = mongoose.model("StaffCredential", StaffSchema);

module.exports = StaffCredential;