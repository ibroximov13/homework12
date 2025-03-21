const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User } = require("../model");

function VerifyToken(req, res, next) {
    let authHeader = req.header("Authorization");

    if (!authHeader) {
        return res.status(404).send({message: "Token not found"})
    };

    let token = authHeader.split(' ')[1];

    if (authHeader.startsWith("Bearer Bearer")) {
        token = authHeader.split(' ')[2];
    };

    if (!token) {
        return res.status(400).send({message: "Token mismatch, please try again"})
    }
    try {
        let JWT_SECRET = process.env.JWT_SECRET || "nimadir2";
        let matchToken = jwt.verify(token, JWT_SECRET);
        if (!matchToken) {
            return res.status(400).send("Token is not valid");
        }
        req.user = matchToken.id;
        next()
    } catch (error) {
        console.log(error);
        res.status(401).send(error)
    }
}