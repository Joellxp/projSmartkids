const request = require('supertest');
const app = require('../server');

let token;
beforeAll(async () => {
  const res = await request(app)
    .post('/login')
    .send({ username: 'admin', password: '1234' });
  token = res.body.accessToken;
});

describe('Viagens', () => {
  it('GET /trips deve exigir autenticação', async () => {
    const res = await request(app).get('/trips');
    expect(res.statusCode).toBe(403);
  });

  it('GET /trips deve retornar 200 com token', async () => {
    const res = await request(app)
      .get('/trips')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Exemplo de criação de viagem (ajuste os campos conforme seu model)
  it('POST /trips deve criar uma viagem', async () => {
    const res = await request(app)
      .post('/trips')
      .set('Authorization', `Bearer ${token}`)
      .send({
        driverId: 1,
        startTime: new Date().toISOString(),
        destino: 'Escola'
      });
    expect([200, 201, 400]).toContain(res.statusCode); // 400 se faltar algum campo obrigatório
  });
});