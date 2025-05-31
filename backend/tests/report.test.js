const request = require('supertest');
const app = require('../server');

let token;
beforeAll(async () => {
  const res = await request(app)
    .post('/login')
    .send({ username: 'admin', password: '1234' });
  token = res.body.accessToken;
});

describe('Relatórios', () => {
  it('GET /reports/totals deve exigir autenticação', async () => {
    const res = await request(app).get('/reports/totals');
    expect(res.statusCode).toBe(403);
  });

  it('GET /reports/totals deve retornar 200 com token', async () => {
    const res = await request(app)
      .get('/reports/totals')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
  });
});