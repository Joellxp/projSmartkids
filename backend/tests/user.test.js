const request = require('supertest');
const app = require('../server');

describe('Rotas de Usuário', () => {
  it('GET /users deve exigir autenticação', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(403);
  });
});