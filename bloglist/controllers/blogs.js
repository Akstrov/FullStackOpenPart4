const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  (request.body.title === undefined || request.body.url === undefined) &&
    response.status(400).send();
  return;
  request.body.likes === undefined && (request.body.likes = 0);
  const blog = new Blog(request.body);
  await blog.save();
  response.status(201).json(blog);
});

module.exports = blogsRouter;
