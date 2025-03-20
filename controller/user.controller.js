const { totp } = require("otplib")
const bcrypt = require("bcrypt")
// const {sendSms} = require("../config/eskiz")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
const { User } = require("../model");
const { createUserValidate, sendOtpValidate, verifyOtpValidate, userLoginValidate, refreshTokenValidate } = require("../validation/user.validation");
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;


async function findUser(phone) {
    return await User.findOne({ where: { phone } });
}

totp.options = {
    digits: 4,
    step: 300
};

async function sendOtp(req, res) {
    let {error, value} = sendOtpValidate(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }
    const { phone } = value;
    const user = await findUser(phone);
    // if (user) {
    //     return res.status(400).send({ message: "User exists" });
    // }
    let otp = totp.generate(phone + "soz");
    // await sendSms(phone, otp);
    res.send({ otp });
}

async function verifyOtp(req, res) {
    let {error, value} = verifyOtpValidate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    let { phone, otp } = value;
    const isValid = totp.verify({ token: otp, secret: phone + "soz" });

    if (isValid) {
        res.send({ message: "OTP verified successfully" });
    } else {
        res.status(400).send({ message: "Invalid OTP" });
    }
}

async function register(req, res) {
    try {
        let {error, value} = createUserValidate(req.body);
        if (error) { 
            return res.status(400).send(error.details[0].message);
        }
        console.log(value);
        const { fullName, year, phone, email, password, region_id, role } = value;

        let existingUser = await User.findOne({ where: { phone } });
        if (existingUser) {
            return res.status(400).send({ message: "User already exists" });
        }

        let hashedPassword = bcrypt.hashSync(password, 10);
        let newUser = await User.create({ fullName, year, phone, email, password: hashedPassword, region_id, role });

        res.status(201).json({ user: newUser });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}

async function loginUser(req, res) {
    try {
        let {error, value} = userLoginValidate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        let {phone, password} = value;
        let newUser = await User.findOne({where: {phone}});
        if (!newUser) {
            return res.status(404).send({message: "User not found"});
        };
        let compiredPassword = bcrypt.compareSync(password, newUser.password);
        if (!compiredPassword) {
            return res.status(400).send({message: "Password wrong error"});
        }

        const accesstoken = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: "1h" });
        const refreshtoken = jwt.sign({ id: newUser.id }, REFRESH_SECRET, { expiresIn: "7d" });
        refreshTokens.add(refreshtoken);

        res.send({accesstoken, refreshtoken});
        
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
    let {error, value} = refreshTokenValidate(req.body);
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

module.exports = { findUser, sendOtp, verifyOtp, register, uploadImage, refreshToken, loginUser }