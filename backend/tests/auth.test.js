const request = require('supertest');
const app = require('../server');

describe('Autenticação', () => {
  it('POST /login deve falhar com credenciais inválidas', async () => {
    const res = await request(app)
      .post('/login')
      .send({ username: 'invalido', password: 'errado' });
    expect(res.statusCode).toBe(401);
  });

  it('POST /login deve retornar token com credenciais válidas', async () => {
    const res = await request(app)
      .post('/login')
      .send({ username: 'admin', password: '1234' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });
});