const supertest = require('supertest');
const app = require('../src/server/index');
const request = supertest(app);
import "regenerator-runtime/runtime";


describe('test Server', () => {
  it('/test', async (done) => {
    const response = await request.get('/test');
    expect(response.status).toBe(200);
    done();
  });
});