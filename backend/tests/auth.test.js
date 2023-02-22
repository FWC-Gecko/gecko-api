const server = require('../app');
const { connectDatabase, disconnectDatabase } = require('../config/database');
const supertest = require('supertest');
const request = supertest(server);

describe('User Login', () => {
  beforeAll((done) => {
    connectDatabase();
    done();
  });
  it('Should login with lowercase email', (done) => {
    request
      .post('/api/v1/auth/login')
      .send({ email: 'umamlikeyou@gmail.com', password: 'asdfasdf' })
      .expect(201)
      .then((response) => {
        expect(response.body.success).toEqual(true);
        done();
      });
  });
  it('Should login with uppercase email', (done) => {
    request
      .post('/api/v1/auth/login')
      .send({ email: 'UMAMLIKEYOU@gmail.com', password: 'asdfasdf' })
      .expect(201)
      .then((response) => {
        expect(response.body.success).toEqual(true);
        done();
      });
  });
  it('Should login with no-case email', (done) => {
    request
      .post('/api/v1/auth/login')
      .send({ email: 'UMAMLiKEyOU@gmail.com', password: 'asdfasdf' })
      .expect(201)
      .then((response) => {
        expect(response.body.success).toEqual(true);
        done();
      });
  });
  afterAll((done) => {
    disconnectDatabase();
    done();
  });
});
