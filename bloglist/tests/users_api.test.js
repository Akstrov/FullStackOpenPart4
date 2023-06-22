const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');

const api = supertest(app);

const initialUsers = {
  username: 'akstrov',
  name: 'Youssef El hardouzi',
  password: 'stonerule',
};

describe('User test', () => {
  beforeAll(async () => {
    await User.deleteMany({});
    await api.post('/api/users').send(initialUsers);
  }, 10000);

  test('Inserting short username', async () => {
    const response = await api.post('/api/users').send({
      username: 'a',
      password: '123456',
      name: 'test',
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Bad Request');
  });
  test('Inserting existing username', async () => {
    const response = await api.post('/api/users').send({
      username: 'akstrov',
      password: '123456',
      name: 'test',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Bad Request');
  });
  test('Inserting short password', async () => {
    const response = await api.post('/api/users').send({
      username: 'hamada',
      password: 'a',
      name: 'test',
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Password must be more than 3 characters'
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
