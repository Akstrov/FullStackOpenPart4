const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

const initialBlogs = [
  {
    title: 'The Charter House of Parma',
    author: 'Stendhal',
    url: 'www.parma.com',
    likes: 2,
  },
  {
    title: 'The Power of now',
    author: 'Eckhart Tolle',
    url: 'www.power.com',
    likes: 6,
  },
];

describe('Test Blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    for (const blog of initialBlogs) {
      const user = await api.post('/api/login').send({
        username: 'akstrov',
        password: 'stonerule',
      });
      const token = user.body.token;
      //set authorization in header
      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blog);
    }
  }, 10000);

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
    const user = await api.post('/api/login').send({
      username: 'akstrov',
      password: 'stonerule',
    });
    const token = user.body.token;
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
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
  test('Posting a blog fail without authorization', async () => {
    await api
      .post('/api/blogs')
      .send({
        title: 'The Power of now',
        author: 'Eckhart Tolle',
        url: 'www.power.com',
        likes: 6,
      })
      .expect(401);
  });

  test('Missing likes defaults to 0', async () => {
    const user = await api.post('/api/login').send({
      username: 'akstrov',
      password: 'stonerule',
    });
    const token = user.body.token;
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({
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

  test('Delete blog works', async () => {
    //get id of the first blog
    const response = await api.get('/api/blogs');
    const blogId = response.body[0].id;
    //delete blog
    const user = await api.post('/api/login').send({
      username: 'akstrov',
      password: 'stonerule',
    });
    const token = user.body.token;
    const response2 = await api
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${token}`);
    const blogs = await Blog.find({});
    expect(blogs.length).toBe(initialBlogs.length - 1);
    expect(response2.status).toBe(200);
  });

  test('Update blog', async () => {
    //get id of the first blog
    const response = await api.get('/api/blogs');
    const blogId = response.body[0].id;
    //update like in a blog
    const response2 = await api.put(`/api/blogs/${blogId}`).send({
      likes: 10,
    });
    const blogs = await Blog.find({});
    expect(blogs.length).toBe(initialBlogs.length);
    //find the updated blog
    const updatedBlog = blogs.find((blog) => blog.id === blogId);
    expect(updatedBlog.likes).toBe(10);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
