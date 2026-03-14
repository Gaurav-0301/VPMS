const express = require("express");
const app = express();
require("dotenv").config();

const connectDB = require("./config/db");
connectDB();

const router = require("./routes/user.routes");

const PORT = process.env.PORT || 5000;


app.use(express.json());


app.use("/", router);

app.get("/", (req, res) => {
    res.status(200).send("Hello Jee");
});


app.listen(PORT, () => {
    console.log(`Server is up and running on http://localhost:${PORT}`);
});