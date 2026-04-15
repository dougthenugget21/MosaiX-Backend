const request = require('supertest');
const app = require('../../api/app');
const { resetTestDB } = require('./config');
const db = require('../../db/connect');

describe('User API Integration Tests', () => {
  let api;

  beforeAll(() => {
    api = app.listen(4001, () => {
      console.log('Test server running on port 4001');
    });
  });

  beforeEach(async () => {
    await resetTestDB();
  });

  afterAll((done) => {
    console.log('Closing test server');
    api.close(done);
  });

  // Create User
  describe('POST /userData/create', () => {

    it('should create a new user and return token', async () => {
      const newUser = {
        email: 'test@gmail.com',
        password: 'password123'
      };

      const response = await request(api)
        .post('/userData/create')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('email', 'test@gmail.com');
      expect(response.body).toHaveProperty('user_id');

      // verify in DB
      const dbRes = await db.query("SELECT * FROM user_details WHERE email=$1", ['test@gmail.com']);
      expect(dbRes.rows.length).toBe(1);
    });

    it('should return 401 if email is missing', async () => {
      const response = await request(api)
        .post('/userData/create')
        .send({ password: 'password123' });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Email address is missing');
    });
  });

  // Login
  describe('POST /userData/login', () => {

    beforeEach(async () => {
      // Insert test user directly into DB
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('password123', 10);

      await db.query(
        "INSERT INTO user_details (email, password) VALUES ($1, $2)",
        ['test@gmail.com', hashedPassword]
      );
    });

    it('should login user and return token', async () => {
      const response = await request(api)
        .post('/userData/login')
        .send({
          email: 'test@gmail.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('email', 'test@gmail.com');
      expect(response.body).toHaveProperty('user_id');
    });

    it('should return 401 if password is incorrect', async () => {
      const response = await request(api)
        .post('/userData/login')
        .send({
          email: 'test@gmail.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('User could not be authenticated');
    });

    it('should return 401 if user does not exist', async () => {
      const response = await request(api)
        .post('/userData/login')
        .send({
          email: 'nouser@gmail.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
    });
  });
});