function verifyToken(roles) {
    return (req, res, next) => {
        let authHeader = req.header("Authorization");
        // console.log(authHeader);
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
            let matchToken = jwt.verify(token, "nimadir2");
            if (roles.includes(matchToken.role)) {
                req.user = matchToken.id;
                req.userRole = matchToken.role;
                next()
            } else {
                res.status(400).send({message: "Unfortunately, you do not have admin rights."})
            }
        } catch (error) {
            res.send(error)
        }

    }
};

module.exports = verifyToken
