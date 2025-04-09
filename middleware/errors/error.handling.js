const ApiError = require("../../helpers/api.error");
const logger = require("../../services/logger.service");

module.exports = function (err, req, res, next) {
  logger.error(err);  
 
  if (err instanceof ApiError) {
    return res.status(err.status).json(err.toJSON());
  }

  if (err instanceof SyntaxError) {
    return res.status(err.status).json({ messsage: err.message });
  }

  return res.status(500).json(ApiError.internal("Something went wrong !"));
};
