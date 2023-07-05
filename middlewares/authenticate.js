const jwt = require("jsonwebtoken");
const { findUser } = require("../services/users-services");

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    return res.status(401).json({
      message: "Not authorized",
    });
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await findUser({ _id: id });
    if (!user || !user.token || user.token !== token) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = authenticate;
