const jwt = require('jsonwebtoken');
const config = require('./config');

const generateToken = (payload) => {
  console.log('JWT_SECRET:', config.JWT_SECRET); // Debug line
  if (!config.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE
  });
};

const verifyToken = (token) => {
  if (!config.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.verify(token, config.JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken
};