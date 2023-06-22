const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

usersRouter.post('/', async (request, response) => {
  const body = request.body;
  if (body.password.length < 3) {
    return response
      .status(400)
      .json({ message: 'Password must be more than 3 characters' });
  }
  const salt = 10;
  const hashedPassword = await bcrypt.hash(body.password, salt);
  const user = new User({
    username: body.username,
    name: body.name,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (error) {
    response.status(400).json({ message: 'Bad Request' });
  }
});

usersRouter.get('/', async (request, response) => {
  //get all users
  try {
    const users = await User.find().populate('blogs');
    response.status(200).json(users);
  } catch (error) {
    response.status(400).json(error);
  }
});

module.exports = usersRouter;
