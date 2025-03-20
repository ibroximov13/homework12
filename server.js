const express = require("express");
const { connectDb } = require("./config/db");
const { initData } = require("./config/initData");

const app = express();
require("dotenv").config()
app.use(express.json());

app.use("/image", express.static("uploadsUserImage"));

const indexRoute = require("./routes/index");
app.use("/", indexRoute);

connectDb();
initData();


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server started has been on PORT: ${PORT}`)
});