import { test, expect } from '@playwright/test';

// Define a URL base do backend Spring Boot para centralizar as requisições
const API_URL = 'http://localhost:8080';
const testUser = { email: 'usuario@teste.com', password: 'Senha@123' };

// 'test.describe': agrupa os testes de endpoints de post
test.describe('API — Posts e Curtidas', () => {
  test.beforeEach(async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/signup`, { data: testUser });
    expect([200, 409]).toContain(response.status());
  });

  // ─────────────────────────────────────────────────────────
  // TESTE DE API 1: GET /posts — Listar todos os posts
  // ─────────────────────────────────────────────────────────
  test('GET /posts — deve retornar lista de posts com status 200', async ({ request }) => {
    // 'request.get': faz uma requisição HTTP do tipo GET sem abrir navegador
    const response = await request.get(`${API_URL}/posts`);

    // 'expect(response.ok()).toBeTruthy()': valida se o status HTTP está na faixa de sucesso (200-299)
    expect(response.ok()).toBeTruthy();

    // 'response.json()': converte o payload de resposta JSON em um objeto JavaScript
    const body = await response.json();

    // Valida que o JSON retornado possui a propriedade 'posts'
    expect(body.posts).toBeDefined();

    // 'Array.isArray(body.posts)': valida se 'posts' é uma lista (array)
    expect(Array.isArray(body.posts)).toBeTruthy();

    // Garante que a lista não veio vazia (possui mais de 0 posts)
    expect(body.posts.length).toBeGreaterThan(0);
  });

  // ─────────────────────────────────────────────────────────
  // TESTE DE API 2: GET /posts?limit=5 — Listar posts com limite
  // ─────────────────────────────────────────────────────────
  test('GET /posts?limit=5 — deve retornar no máximo 5 posts', async ({ request }) => {
    // 'params: { limit: 5 }': o Playwright anexa como query param na URL -> /posts?limit=5
    const response = await request.get(`${API_URL}/posts`, {
      params: { limit: 5 }
    });

    // Valida sucesso na requisição
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.posts).toBeDefined();
    expect(Array.isArray(body.posts)).toBeTruthy();

    // 'toBeLessThanOrEqual(5)': valida que a API respeitou o limite solicitado de até 5 itens
    expect(body.posts.length).toBeLessThanOrEqual(5);
  });

  // ─────────────────────────────────────────────────────────
  // TESTE DE API 3: GET /posts?limit=5&skip=0 — Paginação com skip
  // ─────────────────────────────────────────────────────────
  test('GET /posts?limit=5&page=1 — deve retornar posts da primeira página', async ({ request }) => {
    // Envia limit=5 e skip=0 (paginação baseada em offset)
    const response = await request.get(`${API_URL}/posts`, {
      params: { limit: 5, skip: 0 }
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();

    expect(body.posts).toBeDefined();
    expect(Array.isArray(body.posts)).toBeTruthy();
    expect(body.posts.length).toBeGreaterThan(0);
  });

  // ─────────────────────────────────────────────────────────
  // TESTE DE API 4: POST /posts/{postId}/like?userId={userId}
  // ─────────────────────────────────────────────────────────
  test('POST /posts/like — deve curtir um post e retornar sucesso', async ({ request }) => {
    // 1. Faz login primeiro para obter o ID real do usuário no banco
    const loginResponse = await request.post(`${API_URL}/auth/signin`, {
      data: {
        email: testUser.email,
        password: testUser.password
      }
    });
    expect(loginResponse.ok()).toBeTruthy();
    const loginBody = await loginResponse.json();
    const userId = loginBody.id; // Extrai o ID retornado pelo backend

    // 2. Dispara POST para curtir o post com ID 1 passando o userId via query parameter
    const postId = 1;
    const likeResponse = await request.post(`${API_URL}/posts/${postId}/like`, {
      params: { userId }
    });

    // Valida se o endpoint retornou status 200 de sucesso
    expect(likeResponse.ok()).toBeTruthy();
  });

  // ─────────────────────────────────────────────────────────
  // TESTE DE API 5: GET /posts/liked?userId={userId}
  // ─────────────────────────────────────────────────────────
  test('GET /posts/liked/{userId} — deve retornar posts curtidos pelo usuário', async ({ request }) => {
    // 1. Obtém o ID do usuário via login
    const loginResponse = await request.post(`${API_URL}/auth/signin`, {
      data: {
        email: testUser.email,
        password: testUser.password
      }
    });
    expect(loginResponse.ok()).toBeTruthy();
    const loginBody = await loginResponse.json();
    const userId = loginBody.id;

    // 2. Faz requisição GET para buscar os posts curtidos por aquele usuário específico
    const likedResponse = await request.get(`${API_URL}/posts/liked`, {
      params: { userId }
    });

    // Valida se a resposta foi 200 e se contém uma lista de posts curtidos
    expect(likedResponse.ok()).toBeTruthy();
    const likedBody = await likedResponse.json();
    expect(likedBody.posts).toBeDefined();
    expect(Array.isArray(likedBody.posts)).toBeTruthy();
  });

  // ─────────────────────────────────────────────────────────
  // TESTE DE API 6: POST /posts/{postId}/like?userId={userId} (Toggle)
  // ─────────────────────────────────────────────────────────
  test('POST /posts/unlike — deve remover curtida de um post', async ({ request }) => {
    // 1. Login para capturar o ID do usuário
    const loginResponse = await request.post(`${API_URL}/auth/signin`, {
      data: {
        email: testUser.email,
        password: testUser.password
      }
    });
    expect(loginResponse.ok()).toBeTruthy();
    const loginBody = await loginResponse.json();
    const userId = loginBody.id;

    const postId = 2; // Usa o post 2 para testar a mecânica de toggle (alternância)

    // 2. Primeiro POST: adiciona a curtida
    await request.post(`${API_URL}/posts/${postId}/like`, {
      params: { userId }
    });

    // 3. Segundo POST no mesmo post: a API detecta que já existe curtida e faz o "unlike" (remove)
    const toggleResponse = await request.post(`${API_URL}/posts/${postId}/like`, {
      params: { userId }
    });

    // Valida se a requisição de descurtir funcionou com sucesso (status 200)
    expect(toggleResponse.ok()).toBeTruthy();
  });
});
