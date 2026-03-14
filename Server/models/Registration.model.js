const mongoose = require("mongoose");

const registrationSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    purpose: {
        type: String,
        required: true
    },
    
    number: {
        type: String, 
        required: true,
        unique:false
        
    },
    host: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true
    },
    url: {
        type: String, 
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    refId: {
        type: String,
        default: () => Math.random().toString(36).substring(2, 10).toUpperCase()
    }
}, { timestamps: true }); 


const Reg = mongoose.model("Reg", registrationSchema);

module.exports = Reg;