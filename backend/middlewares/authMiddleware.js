const jwt = require("jsonwebtoken");
const SECRET_KEY = "your_jwt_secret";

exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).send("Unauthorized");

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).send("Invalid token");
        req.user = decoded;
        next();
    });
};
