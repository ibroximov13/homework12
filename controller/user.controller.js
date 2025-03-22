const { totp } = require("otplib")
const bcrypt = require("bcrypt")
// const { sendSms } = require("../config/eskiz")
const nodemailer = require('nodemailer')
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
const { User, Region } = require("../model");
const { createUserValidate, sendOtpValidate, verifyOtpValidate, userLoginValidate, refreshTokenValidate, patchUserValidate, updateMyProfileValidate } = require("../validation/user.validation");
const { Op } = require("sequelize");
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

        res.send({ otp });

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
    const secret = (phone + email) + "soz";
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
        const { phone, password, role, ...rest } = value;

        if (role && (role.toUpperCase() === "ADMIN" || role.toUpperCase() === "SUPERADMIN")) {
            return res.status(403).send({ message: "Siz bu rolni tanlay olmaysiz!" });
        }

        let existingUser = await User.findOne({ where: { phone } });
        if (existingUser) {
            return res.status(400).send({ message: "User already exists" });
        }

        let hashedPassword = bcrypt.hashSync(password, 10);
        let newUser = await User.create({
            ...rest, 
            phone: phone,
            password: hashedPassword,
            role: role
        });

        res.status(201).send(newUser);
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
        let { phone, email, password } = value;
        let newUser = await User.findOne({
            where: {
                [Op.and]: [
                    {phone: phone},
                    {email: email}
                ]
            }
        });
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
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Rasm yuklanishi kerak" });
        }
        const imageUrl = `${req.protocol}://${req.get("host")}/image/${req.file.filename}`;
        res.status(200).json({ url: imageUrl });
    } catch (error) {
        res.status(500).json({ error: "Serverda xatolik yuz berdi" });
    }
};


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
};

async function getAllUsers(req, res) {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        const name = req.query.name || "";
        const order = req.query.order === "DESC" ? "DESC" : "ASC";
        const column = req.query.column || "id"

        let user = await User.findAll({
            where: {
                fullName: {
                    [Op.like]: `%${name}%`
                }
            },
            limit: limit,
            offset: offset,
            order: [[column, order]],
            include: [
                {
                    model: Region
                }
            ],
            attributes: {
                exclude: ["region_id"]
            }
        });
        res.status(200).send(user)
    } catch (error) {
        console.log(error);
    }
};

async function updateUser(req, res) {
    try {
        let {error, value} = patchUserValidate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        };
        let user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).send({message: "User not found"});
        };

        if (Object.keys(value).length === 0) {
            return res.status(400).json({ message: "No fields to update" });
        }

        const updateUser = await user.update(value);
        res.send(updateUser);
    } catch (error) {
        console.log(error);
    }
};

async function deleteUser(req, res) {
    try {
    let id = req.params.id;
    let user = await User.findByPk(id);
    if (!user) {
        return res.status(404).send({message: "User not found"});
    };
    const deleteUser = await user.destroy();
    res.send(deleteUser);
    } catch (error) {
        console.log(error);
    }
}

async function createSuperAdmin(req, res) {
    try {
        let { error, value } = createUserValidate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const { phone, password, role, ...rest } = value;

        if (req.user.role !== "ADMIN") {
            return res.status(403).send({ message: "SuperAdmin yaratishga ruxsatingiz yo'q!" });
        }

        let existingUser = await User.findOne({ where: { phone } });
        if (existingUser) {
            return res.status(400).send({ message: "User already exists" });
        }

        let hashedPassword = bcrypt.hashSync(password, 10);
        let newSuperAdmin = await User.create({
            ...rest,
            phone,
            password: hashedPassword,
            role: "SUPERADMIN"
        });

        res.status(201).json({ user: newSuperAdmin });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

async function getMeProfile(req, res) {
    try {
        const userId = req.user.id;
        const user = await User.findOne({
            where: { id: userId },
            attributes: ["id", "fullName", "email", "phone", "photo"]
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

async function updateMyProfile(req, res) {
    try {
        let {error, value} = updateMyProfileValidate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const userId = req.user.id;
        const user = await User.findOne({
            where: { id: userId },
            attributes: ["id", "fullName", "email", "password", "photo"]
        });

        if (!user) {
            return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
        }

        let { fullName, photo, email, password } = value;

        let updatedData = { fullName, email, photo };

        if (password) {
            updatedData.password = bcrypt.hashSync(password, 10);
        }

        await user.update(updatedData);

        res.json({ message: "Profile successfully updated", user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ichki server xatosi" });
    }
}


module.exports = { findUser, sendOtp, verifyOtp, register, uploadImage, refreshToken, loginUser, getAllUsers, updateUser, deleteUser, uploadImage, createSuperAdmin, getMeProfile, updateMyProfile }
