require('dotenv').config();
const port = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
module.exports = {
  port,
  MONGODB_URI,
};
