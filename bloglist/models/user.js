const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  password: {
    type: String,
    required: true,
  },
  name: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
    if (returnedObject.blogs.length > 0) {
      returnedObject.blogs = returnedObject.blogs.map((blog) => {
        const { likes, user, id, ...rest } = blog;
        return rest;
      });
    }
  },
});

module.exports = mongoose.model('User', userSchema);
