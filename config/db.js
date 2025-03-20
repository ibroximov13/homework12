const {Sequelize} = require("sequelize");
require("dotenv").config();

const db = new Sequelize(process.env.DB_NAME, process.env.DB_ROOT, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false
});

async function connectDb() {
    try {
        await db.authenticate();
        console.log("Connected to db");
        // await db.sync({force: true});
        // console.log("Db synced");
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    connectDb, 
    db
};