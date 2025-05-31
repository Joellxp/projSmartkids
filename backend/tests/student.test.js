const request = require('supertest');
const app = require('../server');

let token;
beforeAll(async () => {
  const res = await request(app)
    .post('/login')
    .send({ username: 'admin', password: '1234' });
  token = res.body.accessToken;
});

describe('Estudantes', () => {
  let createdStudentId;

  it('GET /students/:id deve exigir autenticação', async () => {
    const res = await request(app).get('/students/1');
    expect(res.statusCode).toBe(403);
  });

  it('GET /students/:id deve retornar 404 se não existir', async () => {
    const res = await request(app)
      .get('/students/9999')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });

  it('POST /students deve criar um estudante com sucesso', async () => {
    const res = await request(app)
      .post('/students')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Novo Estudante' });
    createdStudentId = res.body.id;
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Novo Estudante');
  });

  it('GET /students/:id deve retornar estudante existente', async () => {
    const res = await request(app)
      .get(`/students/${createdStudentId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', createdStudentId);
  });
});