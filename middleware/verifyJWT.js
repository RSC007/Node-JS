const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401); // UnAuthorized
  const token = authHeader.split(" ")[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
        const roles = Object.values(decoded.UserInfo.roles)
        if (err) return res.sendStatus(403); // invalid token
        req.username = decoded.UserInfo.username;
        req.roles = roles;
        next();
  });
};

module.exports = verifyJWT;
