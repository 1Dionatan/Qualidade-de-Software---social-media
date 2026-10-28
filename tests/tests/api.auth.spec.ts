import { test, expect, APIRequestContext } from '@playwright/test';

const API_URL = 'http://localhost:8080';
const VALID_PASSWORD = 'Senha@123';

function uniqueUser() {
  return { email: `teste_${Date.now()}_${Math.random().toString(36).slice(2)}@example.com`, password: VALID_PASSWORD };
}

async function createUser(request: APIRequestContext, user = uniqueUser()) {
  const response = await request.post(`${API_URL}/auth/signup`, { data: user });
  expect(response.status()).toBe(200);
  return user;
}

test.describe('API — Autenticação (Auth)', () => {
  test('POST /auth/signup — deve cadastrar novo usuário e retornar seus dados', async ({ request }) => {
    const user = uniqueUser();
    const response = await request.post(`${API_URL}/auth/signup`, { data: user });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({ email: user.email });
    expect(body.id).toEqual(expect.any(Number));
  });

  test('POST /auth/signup — deve rejeitar e-mail duplicado', async ({ request }) => {
    const user = await createUser(request);
    const response = await request.post(`${API_URL}/auth/signup`, { data: user });
    expect(response.status()).toBe(409);
    expect(await response.json()).toMatchObject({ message: 'E-mail já está em uso', status: 409 });
  });

  test('POST /auth/signin — deve autenticar usuário existente', async ({ request }) => {
    const user = await createUser(request);
    const response = await request.post(`${API_URL}/auth/signin`, { data: user });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({ email: user.email });
    expect(body.id).toEqual(expect.any(Number));
  });

  test('POST /auth/signin — deve rejeitar senha incorreta', async ({ request }) => {
    const user = await createUser(request);
    const response = await request.post(`${API_URL}/auth/signin`, { data: { email: user.email, password: 'Outra@123' } });
    expect(response.status()).toBe(401);
    expect(await response.json()).toMatchObject({ message: 'Credenciais inválidas', status: 401 });
  });

  test('POST /auth/signin — deve rejeitar e-mail inexistente', async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/signin`, {
      data: { email: `inexistente_${Date.now()}@example.com`, password: VALID_PASSWORD },
    });
    expect(response.status()).toBe(401);
    expect(await response.json()).toMatchObject({ message: 'Credenciais inválidas', status: 401 });
  });

  test('POST /auth/reset-password — deve confirmar recuperação para usuário existente', async ({ request }) => {
    const user = await createUser(request);
    const response = await request.post(`${API_URL}/auth/reset-password`, { data: { email: user.email } });
    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject({ message: 'Senha redefinida com sucesso (fake)' });
  });
});
