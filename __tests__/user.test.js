const request = require('supertest');
const app = require('../index');  // importa la app de Express

describe('GET /User', () => {
  it('debería responder con status 200 y un mensaje', async () => {
    const res = await request(app).get('/User');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Pruebas para consumo de la api');
  });
});
