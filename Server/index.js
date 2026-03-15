const express = require("express");
const app = express();
require("dotenv").config();

const connectDB = require("./config/db");
connectDB();
const cors = require("cors");

app.use(cors());

const router = require("./routes/user.routes");
const regRouter = require("./routes/staff.reg.routes");
const recordRouter=require('./routes/record.count.routes')
const PORT = process.env.PORT || 5000;


// In your backend server file
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


app.use("/", router);
app.use("/", regRouter);
app.use("/", recordRouter);

app.get("/", (req, res) => {
    res.status(200).send("Hello Jee");
});


app.listen(PORT, () => {
    console.log(`Server is up and running on http://localhost:${PORT}`);
});