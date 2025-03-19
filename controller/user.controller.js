const {totp} = require ("otplib")
const bcrypt = require ("bcrypt")
// const {sendSms} = require("../config/eskiz")
const jwt = require ("jsonwebtoken")
const dotenv = require ("dotenv");

dotenv.config()

async function findUser(phone) {
    return await User.findOne({ where: { phone } });
}

totp.options = {
    digits: 4,
    step: 300
};

 async function sendOtp(req, res) {
    const { phone } = req.body;
    const user = await findUser(phone);
    // if (user) {
    //     return res.status(400).send({ message: "User exists" });
    // }
    let otp = totp.generate(phone + "soz");
    // await sendSms(phone, otp);
    res.send({ otp });
}

 async function verifyOtp(req, res) {
    const { phone, otp } = req.body;
    const isValid = totp.verify({ token: otp, secret: phone + "soz" });

    if (isValid) {
        res.send({ message: "OTP verified successfully" });
    } else {
        res.status(400).send({ message: "Invalid OTP" });
    }
}

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
 async function register(req, res) {
    const { name, phone, password, role } = req.body;
    
    try {
        let existingUser = await User.findOne({ where: { phone } });
        // if (existingUser) {
        //     return res.status(400).send({ message: "User already exists" });
        // }

        let photo = req.file ? req.file.filename : null;
        let hashedPassword = bcrypt.hashSync(password, 10);

        let newUser = await User.create({ 
            name, 
            phone, 
            password: hashedPassword, 
            role, 
            photo 
        });

        const accesstoken = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: "1h" });
        const refreshtoken = jwt.sign({ id: newUser.id}, REFRESH_SECRET, { expiresIn: "7D" });
        refreshTokens.add(refreshtoken);

        res.status(201).json({ user: newUser, accesstoken, refreshtoken });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}

const refreshTokens = new Set();
 async function refreshToken(req, res) {
    const { token } = req.body;
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

module.exports = {findUser, sendOtp, verifyOtp, register, refreshToken}