import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { autenticar } from '../middlewares/autenticar.js';
import { env } from '../config/env.js';

function responseFalsa() {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

test('rechaza solicitudes sin token', () => {
  const res = responseFalsa();
  let continuo = false;
  autenticar({ get: () => '', cookies: {} }, res, () => { continuo = true; });
  assert.equal(res.statusCode, 401);
  assert.equal(continuo, false);
});

test('acepta un JWT válido y establece el usuario', () => {
  const token = jwt.sign({ email: 'demo@example.com' }, env.jwtSecret, {
    subject: '507f1f77bcf86cd799439011', algorithm: 'HS256', expiresIn: '1h',
  });
  const req = { get: () => `Bearer ${token}` };
  const res = responseFalsa();
  let continuo = false;
  autenticar(req, res, () => { continuo = true; });
  assert.equal(continuo, true);
  assert.deepEqual(req.user, { id: '507f1f77bcf86cd799439011', email: 'demo@example.com' });
});

test('rechaza un JWT vencido', () => {
  const token = jwt.sign({ email: 'demo@example.com' }, env.jwtSecret, {
    subject: '507f1f77bcf86cd799439011', algorithm: 'HS256', expiresIn: -1,
  });
  const res = responseFalsa();
  autenticar({ get: () => `Bearer ${token}` }, res, () => assert.fail('No debe autenticar un token vencido'));
  assert.equal(res.statusCode, 401);
});
