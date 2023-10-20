const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 5,
  handler: (req, res, next) => {
    const remainingTime = Math.ceil(
      (req.rateLimit.resetTime - Date.now()) / 1000
    );

    res.status(429).json({
      message: `Too many login attemps. Please try again in ${remainingTime} seconds.`,
    });
  },
});

module.exports = loginLimiter;
