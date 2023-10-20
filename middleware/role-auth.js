const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.userData.role; // user data is store in req.userData

    if (allowedRoles.includes(userRole)) {
      // User has the required role, proceed to the route handler
      next();
    } else {
      // User does not have the required role, return a 403 Forbidden response
      return res.status(403).json({
        Message: "Access forbidden. You do not have the required role.",
      });
    }
  };
};

module.exports = checkRole;
