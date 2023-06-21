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

blogsRouter.delete('/:id', async (request, response) => {
  //get the id
  const id = request.params.id;
  const blog = await Blog.findByIdAndDelete(id);

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
