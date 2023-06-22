const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user');
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  if (request.body.title === undefined || request.body.url === undefined) {
    response.status(400).send();
    return;
  }
  if (!request.token) {
    response.status(401).send();
  }
  try {
    request.body.likes === undefined && (request.body.likes = 0);
    const token = request.token;
    const user = request.user;
    const userId = user._id;
    request.body.user = userId;
    const blog = new Blog(request.body);
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(blog);
  } catch (error) {
    console.error(error);
  }
});

blogsRouter.delete('/:id', async (request, response) => {
  const token = request.token;
  const user = request.user;
  //get the blog id
  const id = request.params.id;
  //get the blog
  const blog = await Blog.findById(id);
  //get the user
  const userId = blog.user;
  //check if the user owns the blog
  if (userId.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'You are not authorized' });
  }
  //remove the blog
  user.blogs = user.blogs.filter((b) => b != id);
  await user.save();

  const removedBlog = await Blog.findByIdAndDelete(id);

  response.status(200).json(blog);
});

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id;
  //update blog likes
  const blog = await Blog.findByIdAndUpdate(id, {
    likes: request.body.likes,
  });
  response.status(200).json(blog);
});
module.exports = blogsRouter;
