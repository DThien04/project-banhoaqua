const ApiError = require("../../../../core/ApiError")
const httpStatus = require("../../../../core/httpStatus");
const { ROLE_PERMISSIONS } = require("./permissions");
exports.requireRole = (...roles) => (req, res, next) => {
  const role = req.user?.role;

  if (!role || !roles.includes(role)) {
    return next(new ApiError(httpStatus.FORBIDDEN, "Forbidden"))
  }
  next();


};

exports.requirePermission = (...permissions) => (req, res, next) => {
  const role = req.user?.role;
  console.log(role)
  if (!role) {
    return next(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
  }

  const granted = ROLE_PERMISSIONS[role] || [];
  const ok = permissions.every((p) => granted.includes(p));

  if (!ok) {
    return next(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
  }

  next();
};