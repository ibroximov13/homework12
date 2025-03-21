const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User } = require("../model");

function verifyTokenAndRole(roles) {
    return (req, res, next) => {
        let authHeader = req.header("Authorization");
        if (!authHeader) {
            return res.status(400).send({message: "Token not found"});
        }
        let token = authHeader?.split(" ")[1];
        
        if (authHeader.startsWith("Bearer Bearer ")) {
            token = authHeader.split(" ")[2];
        };
        if (!token) {
            return res.status(400).send({message: "Token not found"});
        }
        try {
            let JWT_SECRET = process.env.JWT_SECRET || "nimadir2";
            let matchToken = jwt.verify(token, JWT_SECRET);
            if (roles.includes(matchToken.role)) {
                req.user = {id: matchToken.id, role: matchToken.role};
                next()
            } else {
                res.status(400).send({message: "Unfortunately, you do not have admin rights."})
            }
        } catch (error) {
            res.send(error)
        }

    }
};

module.exports = verifyTokenAndRole