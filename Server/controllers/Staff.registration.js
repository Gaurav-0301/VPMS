const reg = require('../models/Registration.model');
const staff = require('../models/Staff.credential');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createStaff = async (req, res) => {
    const { name, email, password, role, dept } = req.body;

    try {
        if (!name || !email || !password || !role || !dept) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const staffDetail = await staff.create({
            name,
            email,
            password: hashedPassword,
            role,
            dept
        });

        return res.status(201).json({
            success: true,
            message: "New Staff Added successfully",
            data: {
                id: staff._id,
                name: staff.name,
                email: staff.email
            }
        });

    } catch (error) {
        // Handle Duplicate Email Error (MongoDB Error Code 11000)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "This email is already registered."
            });
        }

        console.error("Registration Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


const logoutStaff = async (req, res) => {
    try {
        // If you are using cookies, clear them here:
        // res.clearCookie('token'); 

        res.status(200).json({ 
            success: true, 
            message: "Logged out successfully. Please remove token from client storage." 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { loginStaff, logoutStaff };

const getHosts = async (req, res) => {
    try {
        const hosts = await staff.find({ role: "Host" }).select("name _id dept");
        res.status(200).json({ success: true, data: hosts });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch hosts" });
    }
};


module.exports = {createStaff,loginStaff, getHosts,logoutStaff};