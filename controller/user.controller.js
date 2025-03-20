const { totp } = require("otplib")
const bcrypt = require("bcrypt")
// const { sendSms } = require("../config/eskiz")
const nodemailer = require('nodemailer')
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
const { User } = require("../model");
const { createUserValidate, sendOtpValidate, verifyOtpValidate, userLoginValidate, refreshTokenValidate } = require("../validation/user.validation");
dotenv.config()

totp.options = {
    digits: 4,
    step: 300
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const SECRET_KEY = 'xusniddin';
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

async function findUser(phone) {
    return await User.findOne({ where: { phone } });
}

async function sendOtp(req, res) {
    let { error, value } = sendOtpValidate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const { phone, email } = value;

    if (!phone || !email) {
        return res.status(400).send({ message: "Telefon raqam va email majburiy!" });
    }

    let otp = totp.generate(phone + email + "soz");

    try {
        // await sendSms(phone, otp);

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Sizning OTP kodingiz",
            text: `Sizning tasdiqlash kodingiz: ${otp}`,
        });

        res.send({ message: "OTP telefon va email orqali yuborildi", otp });

    } catch (error) {
        console.error("OTP jo'natishda xatolik:", error);
        res.status(500).send({ message: "OTP jo'natishda xatolik yuz berdi" });
    }
}

async function verifyOtp(req, res) {
    let { error, value } = verifyOtpValidate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    let { phone, email, otp } = value;
    const secret = (phone || email) + "soz";
    const isValid = totp.verify({ token: otp, secret });

    if (isValid) {
        res.send({ message: "OTP verified successfully" });
    } else {
        res.status(400).send({ message: "Invalid OTP" });
    }
}

async function register(req, res) {
    try {
        let { error, value } = createUserValidate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        console.log(value);
        const { fullName, year, phone, email, password, region_id, role } = value;

        if (role && (role.toUpperCase() === "ADMIN" || role.toUpperCase() === "SUPERADMIN")) {
            return res.status(403).send({ message: "Siz bu rolni tanlay olmaysiz!" });
        }

        let existingUser = await User.findOne({ where: { phone } });
        if (existingUser) {
            return res.status(400).send({ message: "User already exists" });
        }

        let hashedPassword = bcrypt.hashSync(password, 10);
        let newUser = await User.create({
            fullName, year, phone, email,
            password: hashedPassword, region_id,
            role
        });

        res.status(201).json({ user: newUser });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}

async function loginUser(req, res) {
    try {
        let { error, value } = userLoginValidate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        let { phone, password } = value;
        let newUser = await User.findOne({ where: { phone } });
        if (!newUser) {
            return res.status(404).send({ message: "User not found" });
        };
        let compiredPassword = bcrypt.compareSync(password, newUser.password);
        if (!compiredPassword) {
            return res.status(400).send({ message: "Password wrong error" });
        }

        const accesstoken = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: "1h" });
        const refreshtoken = jwt.sign({ id: newUser.id }, REFRESH_SECRET, { expiresIn: "7d" });
        refreshTokens.add(refreshtoken);

        res.send({ accesstoken, refreshtoken });

    } catch (error) {
        console.log(error);
    }
}

async function uploadImage(req, res) {
    if (!req.file) {
        return res.status(400).json({ error: "Rasm yuklanishi kerak" });
    }
    res.status(200).json({ message: "Rasm muvaffaqiyatli yuklandi", filename: req.file.filename });
}

const refreshTokens = new Set();
async function refreshToken(req, res) {
    let { error, value } = refreshTokenValidate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const { token } = value;
    if (!token || !refreshTokens.has(token)) {
        return res.status(403).send({ message: "Refresh token noto'g'ri yoki eskirgan" });
    }

    try {
        const payload = jwt.verify(token, REFRESH_SECRET);
        const newAccessToken = jwt.sign({ id: payload.id, role: payload.role }, JWT_SECRET, { expiresIn: "1h" });

        res.json({ accesstoken: newAccessToken });
    } catch (err) {
        res.status(403).send({ message: "Noto'g'ri refresh token" });
    }
}

async function createSuperAdmin(req, res) {
    try {
        const { fullName, year, phone, email, password, region_id } = req.body;

        if (req.user.role !== "ADMIN") {
            return res.status(403).send({ message: "SuperAdmin yaratishga ruxsatingiz yo'q!" });
        }

        let existingUser = await User.findOne({ where: { phone } });
        if (existingUser) {
            return res.status(400).send({ message: "User already exists" });
        }

        let hashedPassword = bcrypt.hashSync(password, 10);
        let newSuperAdmin = await User.create({
            fullName, year, phone, email,
            password: hashedPassword, region_id,
            role: "SUPERADMIN"
        });

        res.status(201).json({ user: newSuperAdmin });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}


module.exports = { findUser, sendOtp, verifyOtp, register, uploadImage, refreshToken, loginUser, createSuperAdmin }
