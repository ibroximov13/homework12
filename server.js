const express = require("express");
const { connectDb } = require("./config/db");
const { initData } = require("./config/initData");
const setupSwagger = require("./config/swagger");

const app = express();
require("dotenv").config()
app.use(express.json());
setupSwagger(app);

app.use("/image", [
    express.static("uploadsUserImage"),
    express.static("uploadsCategoryImage"),
    express.static("uploadsProductImage")
]);

const indexRoute = require("./routes/index");
app.use("/api", indexRoute);

connectDb();
initData();


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server started has been on PORT: ${PORT}`)
});