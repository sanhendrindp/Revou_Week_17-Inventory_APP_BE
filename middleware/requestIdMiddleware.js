const { v4: uuidv4 } = require("uuid");

const requestIdMiddleware = (req, res, next) => {
  if (req.headers["x-request-id"]) {
    res.setHeader("x-request-id", req.headers["x-request-id"]);
    req.request_id = req.headers["x-request-id"];
  } else {
    const uuid = uuidv4();
    res.setHeader("x-request-id", uuid);
    req.request_id = uuid;
  }
  next();
};

module.exports = requestIdMiddleware;
