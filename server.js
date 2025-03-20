const express = require("express");
const { connectDb } = require("./config/db");
require("dotenv").config()
const app = express();
app.use(express.json());
connectDb();

app.use("/image", express.static("uploadsUserImage"));

const indexRoute = require("./routes/index");
app.use("/", indexRoute);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server started has been on PORT: ${PORT}`)
});