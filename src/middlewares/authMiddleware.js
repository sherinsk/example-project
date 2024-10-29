const jwt = require('jsonwebtoken');

module.exports = {
  verifyUserToken: (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        throw new Error('Token is missing!');
      }

      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          throw new Error('Token is not valid!');
        }

        if (!decoded.userId) {
          throw new Error('Invalid token payload!');
        }

        req.vendorId = decoded.userId;
        next();  // Proceed to the next middleware or route handler if token is valid
      });
    } catch (error) {
      next(error);  // Pass the error to the error-handling middleware
    }
  }
};
