const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected...");
    } catch (error) {
        console.log("Database connectivity error:", error);
        process.exit(1); // stop server if DB fails
    }
};

module.exports = connectDB;