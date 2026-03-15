const StaffCredential = require("../models/Staff.credential");
const bcrypt = require("bcrypt");

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

        const staffDetail = await StaffCredential.create({
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
                id: staffDetail._id,
                name: staffDetail.name,
                email: staffDetail.email
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

module.exports = createStaff;