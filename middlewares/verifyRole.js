const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

function verifyRole(newData) {
  return (req, res, next) => {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(401).send({ error: "Token not found" });
    }

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    try {
      let data = jwt.verify(token, process.env.accesstoken);
      if (newData.includes(data.role)) {
        req.user = data;
        next();
      } else {
        return res.status(403).send({ error: "You can't take action" });
      }
    } catch (error) {
      res.status(401).send({ Error: "Wrong token" });
      console.log({ error });
    }
  };
}

module.exports = verifyRole;
