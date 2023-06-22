const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userExtractor = async (request, response, next) => {
  if (
    request.get('Authorization') &&
    request.get('Authorization').startsWith('Bearer ')
  ) {
    const token = request.get('Authorization').replace('Bearer ', '');
    request.token = token;
  }
  if (request.token) {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    const user = await User.findById(decodedToken.id);
    request.user = user;
  }
  next();
};

module.exports = { userExtractor };
