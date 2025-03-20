const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

async function refreshTokens(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).send({ error: "Refresh token kiritish shart!" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.refreshtoken);

        const newAccessToken = jwt.sign(
            { id: decoded.id, role: decoded.role, type: decoded.type },
            process.env.accesstoken,
            { expiresIn: "15m" }
        );

        res.status(200).send({ accessToken: newAccessToken });
    } catch (error) {
        return res.status(401).send({ error: "Noto'g'ri refresh token" });
    }
}

module.exports = refreshTokens;
