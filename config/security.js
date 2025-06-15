module.exports = {
  jwt: {
    jwtSecret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRATION,
  },
  csrf: {
    enabled: process.env.SECURITY_CSRF === 'true',
    key: '_csrf',
    secret: '_csrfSecret',
  },
};