const request = require('supertest');
const app = require('../server');
const path = require('path');

let token;
beforeAll(async () => {
  const res = await request(app)
    .post('/login')
    .send({ username: 'admin', password: '1234' });
  token = res.body.accessToken;
});

describe('Arquivos', () => {
  it('GET /files deve exigir autenticação', async () => {
    const res = await request(app).get('/files');
    expect(res.statusCode).toBe(403);
  });

  it('POST /files deve fazer upload de PDF', async () => {
    const res = await request(app)
      .post('/files')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', path.join(__dirname, 'dummy.pdf')); // Certifique-se que dummy.pdf existe
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('filename');
  });

  it('GET /files deve listar arquivos', async () => {
    const res = await request(app)
      .get('/files')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});