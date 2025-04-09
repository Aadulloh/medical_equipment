const { format, createLogger, transports } = require("winston");
const { combine, timestamp, label, printf, json } = format;

const myFromat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label} ${level}: ${message}]`;
});

const logger = createLogger({
  format: combine(
    label({ label: "Medical equipments" }),
    timestamp(),
    myFromat,
    json()
  ),
  transports: [
    new transports.Console({ level: "debug" }),
    new transports.File({ filename: "log/error.log", level: "error" }),
    new transports.File({ filename: "log/combine.log", level: "info" }),
  ],
});

logger.exitOnError = false;
logger.exceptions.handle(
  new transports.File({ filename: "log/exaptions.log" })
);
logger.rejections.handle(
  new transports.File({ filename: "log/rejections.log" })
);

module.exports = logger;
