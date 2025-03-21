const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { User } = require("../model");

dotenv.config();

const verifyToken = async (req, res, next) => {
    try {
        const header = req.header("Authorization");
        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({ msg: "Invalid or missing Authorization header" });
        }

        const token = header.split(" ")[1];
        if (!token) {
            return res.status(401).json({ msg: "Empty token" });
        }

        const accessSecret = process.env.JWT_SECRET || "nimadir2";
        const data = jwt.verify(token, accessSecret);

        console.log(data);
        const user = await User.findByPk(data.id);
        console.log(user);
        if (!user) {
            return res.status(401).json({ msg: "Not allowed" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ msg: "Server error", error: error.message });
    }
};

module.exports = verifyToken;
