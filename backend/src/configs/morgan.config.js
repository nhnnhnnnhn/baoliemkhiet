const morgan = require("morgan");

const logger = require("./winston.config");

morgan.token("message", (req, res) => res.locals.errorMessage || "");
const successResponseFormat = `$method :url :status - :response-time ms`;
const errorResponseFormat = `$method :url :status - :response-time ms - message: :message`;

const successHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: {
    write: (message) => {
      logger.info(message.trim(), { label: "morgan" });
    },
  },
});

const errorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: {
    write: (message) => logger.error(message.trim(), { label: "morgan" }),
  },
});

module.exports = {
  successHandler,
  errorHandler,
};
