const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const loginfy = require('./main');
const mongoose = require("mongoose");
const UserModel = require("./utils/user-model-template");

const app = express();
app.use(express.json());
app.use(cookieParser("loginfy-example"));

mongoose.connect(process.env.MONGO_URI, {
    // keepAlive: true,
}).then(() => {
    console.log("connected to mongo!!");
    // this is testing branch code!!
});

// Setup Loginfy
loginfy.setOptions({
  loginOptions: {
    Email: true,
    Password: true,
    Username: true,
  },
  samesite: true,
  usermodel: require("./utils/user-model-template")
});
loginfy.use();

// Setup Loginfy endpoints
app.post('/signup', loginfy.signup);
app.post('/login', loginfy.login);
app.post('/logout', loginfy.logout);

describe('Integration Tests', () => {
  it('should signup a new user', async () => {
    const res = await request(app)
      .post('/signup')
      .send({
        email: 'test@example.com',
        password: 'password',
        username: 'testuser'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('User signed up successfully');
  });

  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'password'
      });

    expect(res.statusCode).toEqual(200);
   // expect(res.body.message).toEqual('User logged in successfully');
  });

  it('should logout a user', async () => {
    const res = await request(app)
      .post('/logout');

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('User logged out successfully');
    await UserModel.deleteMany({});
  });
});
