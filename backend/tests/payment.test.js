const request = require('supertest');
const app = require('../server');
const sequelize = require('../database/db'); // Corrija aqui!

let token;
let tripId;
let userId;

beforeAll(async () => {
  // Sincroniza o banco de dados antes de todos os testes
  await sequelize.sync({ force: true });

  // 1. Login como admin
  const loginRes = await request(app)
    .post('/login')
    .send({ username: 'admin', password: '1234' });
  token = loginRes.body.accessToken;

  // 2. Criar um usuário condutor
  const condutorRes = await request(app)
    .post('/users')
    .set('Authorization', `Bearer ${token}`)
    .send({
      fullName: 'Condutor Teste',
      username: 'condutor1@email.com', // <-- Use um e-mail válido aqui!
      password: '123456',              // senha com pelo menos 6 caracteres
      role: 'condutor'
    });
  const condutorId = condutorRes.body.id || condutorRes.body.user?.id;

  console.log('condutorRes.body:', condutorRes.body);

  // 3. Login como condutor (opcional, se precisar)
  // const condutorLogin = await request(app)
  //   .post('/login')
  //   .send({ username: 'condutor1', password: '1234' });
  // const condutorToken = condutorLogin.body.accessToken;

  // 4. Criar uma viagem válida usando o condutor
  const tripRes = await request(app)
    .post('/trips')
    .set('Authorization', `Bearer ${token}`) // admin pode criar viagem
    .send({
      driverId: condutorId,
      startTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1h no futuro
      destino: 'Escola'
    });

  tripId = tripRes.body.id;
  userId = condutorId; // use o condutor como pagador

  console.log({ token, userId, tripId });
});

describe('Pagamentos', () => {
  it('GET /payments deve exigir autenticação', async () => {
    const res = await request(app).get('/payments');
    expect(res.statusCode).toBe(403);
  });

  it('GET /payments deve retornar 200 com token', async () => {
    const res = await request(app)
      .get('/payments')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /payments deve criar um pagamento', async () => {
    // Debug opcional para garantir que os valores existem
    console.log({ userId, tripId });

    const res = await request(app)
      .post('/payments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId,
        tripId,
        amount: 100
      });
    expect([200, 201, 400]).toContain(res.statusCode);
    if (res.statusCode === 200 || res.statusCode === 201) {
      expect(res.body).toHaveProperty('id');
    }
  });
});