const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const JWT_TOKEN = process.env.JWT_SECRET;

const fetchuser = (req, res, next) => {
  //get the user from the jwt token and add id to req body
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please auth using valid token (no token)" });
  }
  try {
    const data = jwt.verify(token, JWT_TOKEN);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please auth using valid token (unable to find)" });
  }
};

module.exports = fetchuser;
