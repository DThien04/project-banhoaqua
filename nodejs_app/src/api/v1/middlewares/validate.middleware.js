const ApiError = require("../../../core/ApiError");
const httpStatus = require("../../../core/httpStatus");

exports.validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const details = error.details.map(d => ({
      field: d.path.join("."),   // vd: "password"
      message: d.message
    }));

    return next(
      new ApiError(
        httpStatus.UNPROCESSABLE_ENTITY, // 422
        "Validation error",
        details,
        "VALIDATION_ERROR"
      )
    );
  }

  req.body = value;
  next();
};
