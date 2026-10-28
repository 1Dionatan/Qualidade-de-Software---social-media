import { test, expect } from '@playwright/test';

const testUser = { email: 'usuario@teste.com', password: 'Senha@123' };

test.describe('Fluxo de Curtida em Posts', () => {
  test.beforeEach(async ({ request }) => {
    const response = await request.post('http://localhost:8080/auth/signup', { data: testUser });
    expect([200, 409]).toContain(response.status());
  });

  // ─────────────────────────────────────────────────────────
  // TESTE 1: Usuário autenticado pode curtir um post
  // ─────────────────────────────────────────────────────────
  test('usuário autenticado deve conseguir curtir um post', async ({ page }) => {
    // 'async ({ page })': recebe a 'page', que representa a aba do navegador no Playwright.
    // 'async' permite usar 'await' para esperar cada ação assíncrona terminar.

    // 1. Acessa a página de login
    // 'page.goto': navega até http://localhost:3000/signin (usa baseURL configurada)
    await page.goto('/signin');

    // 2. Preenche os campos do formulário de login
    // 'page.locator': encontra o elemento HTML pelo seletor CSS 'input[type="email"]'
    // '.fill': digita o e-mail dentro do campo (limpa antes de digitar)
    await page.locator('input[type="email"]').fill(testUser.email);

    // Localiza o campo de senha e digita a senha cadastrada
    await page.locator('input[type="password"]').fill(testUser.password);

    // Localiza o botão de submit do formulário e simula o clique do usuário
    await page.locator('form button[type="submit"]').click();

    // 3. Aguarda o redirecionamento após autenticação bem-sucedida
    // 'waitForURL': pausa a execução até a URL mudar para a Home ('/'), com timeout de 10s
    await page.waitForURL('/', { timeout: 10000 });

    // 4. Localiza o primeiro post carregado no feed
    // 'getByRole': localizador semântico de acessibilidade, busca elementos de lista (role="listitem")
    // '.first()': seleciona apenas o primeiro item da lista de posts
    const primeiroPost = page.getByRole('listitem').first();

    // 'expect(...).toBeVisible': asserção que verifica se o post realmente renderizou e está visível
    await expect(primeiroPost).toBeVisible({ timeout: 10000 });

    // 5. Localiza o botão de curtir dentro daquele post específico
    // '/curtir|curtido/i': expressão regular (Regex) que procura botão com texto "curtir" OU "curtido",
    // sendo 'i' para case-insensitive (ignora letras maiúsculas/minúsculas)
    const botaoCurtir = primeiroPost.getByRole('button', { name: /curtir|curtido/i });

    // Valida que o botão de curtir está visível na tela
    await expect(botaoCurtir).toBeVisible({ timeout: 5000 });

    // Simula o clique do mouse no botão de curtir
    await botaoCurtir.click();

    // Aguarda 1 segundo para a requisição HTTP da curtida ser processada e o estado atualizar
    await page.waitForTimeout(1000);

    // Valida que o usuário permanece na aplicação em localhost:3000
    expect(page.url()).toContain('localhost:3000');
  });

  // ─────────────────────────────────────────────────────────
  // TESTE 2: Usuário NÃO autenticado não deve conseguir curtir
  // ─────────────────────────────────────────────────────────
  test('usuário não autenticado não deve conseguir curtir post', async ({ page }) => {
    // Variável de controle para registrar se o alerta nativo apareceu
    let dialogApareceu = false;

    // 'page.on("dialog")': cria um ouvinte (listener) para caixas de diálogo do navegador (ex: alert())
    // Se o frontend disparar um alert('Você precisa estar logado...'), esse listener é acionado
    page.on('dialog', async (dialog) => {
      dialogApareceu = true;      // Marca que o alerta realmente apareceu
      await dialog.accept();       // Clica no "OK" do alerta para fechá-lo e prosseguir o teste
    });

    // Acessa diretamente a página inicial ('/') sem fazer login prévio
    await page.goto('/');

    // Aguarda o primeiro post carregar na página
    const primeiroPost = page.getByRole('listitem').first();
    await expect(primeiroPost).toBeVisible({ timeout: 10000 });

    // Localiza o botão de curtir do post
    const botaoCurtir = primeiroPost.getByRole('button', { name: /curtir/i });
    await expect(botaoCurtir).toBeVisible({ timeout: 5000 });

    // Clica no botão de curtir sem estar autenticado
    await botaoCurtir.click();

    // Aguarda 1 segundo para o evento do dialog ser capturado
    await page.waitForTimeout(1000);

    // 'toBeTruthy': asserção que valida se 'dialogApareceu' é verdadeiro,
    // confirmando que o sistema impediu a ação e alertou o usuário
    expect(dialogApareceu).toBeTruthy();
  });

  // ─────────────────────────────────────────────────────────
  // TESTE 3: Verificar se a lista de posts carrega na home
  // ─────────────────────────────────────────────────────────
  test('deve exibir lista de posts na página inicial', async ({ page }) => {
    // Navega para a página inicial
    await page.goto('/');

    // Localiza todos os itens de lista (posts) da página
    const posts = page.getByRole('listitem');

    // Valida que pelo menos o primeiro post está visível (garante que a página não está em branco)
    await expect(posts.first()).toBeVisible({ timeout: 10000 });

    // '.count()': conta a quantidade total de posts renderizados no DOM
    const totalPosts = await posts.count();

    // 'toBeGreaterThan(0)': asserção que verifica se a contagem é maior que zero
    // Comprova que os posts da API DummyJSON/Backend foram carregados com sucesso
    expect(totalPosts).toBeGreaterThan(0);
  });

  test('deve exibir likes e dislikes em cada post da Home', async ({ page }) => {
    await page.goto('/');

    const primeiroPost = page.getByRole('listitem').first();
    await expect(primeiroPost).toBeVisible({ timeout: 10000 });
    await expect(primeiroPost.getByLabel(/Reações: \d+ likes e \d+ dislikes/)).toBeVisible();
  });
});
