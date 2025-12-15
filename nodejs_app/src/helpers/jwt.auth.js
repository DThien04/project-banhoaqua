const jwt = require("jsonwebtoken");

module.exports.generateAccessToken = (user) => {
  if (!user?._id) throw new Error("Missing userId for access token");

  return jwt.sign(
    { sub: user._id.toString(), role: user.role },  
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "1d" }
  );
};

module.exports.verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

// REFRESH TOKEN
module.exports.signRefreshToken = (user) => {
  if (!user?._id) throw new Error("Missing userId for refresh token");

  return jwt.sign(
    { sub: user._id.toString() },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports.verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};
