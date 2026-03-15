const reg = require('../models/Registration.model');
const staff = require('../models/Staff.credential');

// 1. Get total visitor count
const CountVisitor = async (req, res) => {
    try {
        const NumberOfVisitor = await reg.countDocuments();
        return res.status(200).json({
            success: true,
            data: NumberOfVisitor
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "CountVisitor fails"
        });
    }
};

// 2. Get all staff counts in ONE response
const CountStaff = async (req, res) => {
    try {
        // We run these in parallel for better performance
        const [admin, host, security] = await Promise.all([
            staff.countDocuments({ role: "Admin" }),
            staff.countDocuments({ role: "Host" }),
            staff.countDocuments({ role: "Security" })
        ]);

        return res.status(200).json({
            success: true,
            counts: {
                admin,
                host,
                security
               
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "CountStaff fails"
        });
    }
};

// 3. Get all visitor records
const visitorData = async (req, res) => {
    try {
        const data = await reg.find();
        return res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        return res.status(500).json({
            success: false, // Fixed: was true in your snippet
            message: "visitorData error"
        });
    }
};

// 4. Get all staff records
const staffData = async (req, res) => {
    try {
        const data = await staff.find();
        return res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "staffData error"
        });
    }
};

// Export all functions correctly as an object
module.exports = {
    CountVisitor,
    CountStaff,
    visitorData,
    staffData
};