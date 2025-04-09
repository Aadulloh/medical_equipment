const ApiError = require("../../helpers/api.error");

module.exports = (allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user) {
      throw ApiError.unauthorized("Token berilmagan");
    }

    if (!allowedRoles.includes(user.role)) {
      throw ApiError.forbidden("Ruhstat berilmgan foydalnuvchi");
    }
    next();
  };
};
