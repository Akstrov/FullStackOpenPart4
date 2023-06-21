const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

const initialBlogs = [
  {
    _id: '64833de3027090eb8ce82ef7',
    title: 'The Charter House of Parma',
    author: 'Stendhal',
    url: 'www.parma.com',
    likes: 10,
    __v: 0,
  },
  {
    _id: '64833e24027090eb8ce82efb',
    title: 'The Charter House of Parma',
    author: 'Stendhal',
    url: 'www.parma.com',
    likes: 10,
    __v: 0,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  for (const blog of initialBlogs) {
    let savedBlog = new Blog(blog);
    await savedBlog.save();
  }
});

test('the correct number of blogs is returned in json format', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
  expect(response.body.length).toBe(2);
});

test('the database use id instead of _id', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body[0].id).toBeDefined();
});

test('Posting a blog is working', async () => {
  const response = await api
    .post('/api/blogs')
    .send({
      title: 'The Power of now',
      author: 'Eckhart Tolle',
      url: 'www.power.com',
      likes: 6,
    })
    .expect(201)
    .expect('Content-Type', /application\/json/);
  expect(response.body.title).toBe('The Power of now');
  expect(response.body.author).toBe('Eckhart Tolle');
  expect(response.body.url).toBe('www.power.com');
  expect(response.body.likes).toBe(6);

  const blogs = await Blog.find({});
  expect(blogs.length).toBe(initialBlogs.length + 1);
});

test('Missing likes defaults to 0', async () => {
  const response = await api.post('/api/blogs').send({
    title: 'The Power of now',
    author: 'Eckhart Tolle',
    url: 'www.power.com',
  });
  expect(response.body.likes).toBe(0);
});

test('Missing title or url is bad request', async () => {
  const response = await api
    .post('/api/blogs')
    .send({
      author: 'Eckhart Tolle',
      likes: 1,
    })
    .expect(400);
});

afterAll(async () => {
  await mongoose.connection.close();
});
