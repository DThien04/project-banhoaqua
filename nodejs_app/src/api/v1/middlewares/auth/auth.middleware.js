const jwt = require("jsonwebtoken");
const ApiError = require("../../../../core/ApiError");
const httpStatus = require("../../../../core/httpStatus");
const { ROLES } = require("../../../../constants/roles");

// YÊU CẦU ĐÃ ĐĂNG NHẬP
exports.auth = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, "Missing token"));
  }

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    // payload phải dạng { sub, role, ... }
    req.user = payload;
    return next();
  } catch (e) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, "Invalid token"));
  }
};

// YÊU CẦU CÓ MỘT TRONG CÁC ROLE
exports.requireRole = (...roles) => (req, res, next) => {
  // chưa auth hoặc thiếu role
  if (!req.user?.role || !roles.includes(req.user.role)) {
    return next(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
  }
  next();
};

// CHỈ ADMIN
exports.requireAdmin = exports.requireRole(ROLES.ADMIN);
