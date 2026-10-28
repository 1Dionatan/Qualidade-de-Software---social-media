import { test, expect } from '@playwright/test';

const testUser = { email: 'usuario@teste.com', password: 'Senha@123' };

test.describe('Fluxo de Login (Sign In)', () => {
  test.beforeEach(async ({ request }) => {
    const response = await request.post('http://localhost:8080/auth/signup', { data: testUser });
    expect([200, 409]).toContain(response.status());
  });

  // ─────────────────────────────────────────────────────────
  // TESTE 1: Login com credenciais corretas
  // ─────────────────────────────────────────────────────────
  test('deve realizar login com sucesso e redirecionar para home', async ({ page }) => {
    // 1. Acessa a página de autenticação/login (/signin)
    await page.goto('/signin');

    // 2. Valida se o cabeçalho 'Entrar' está visível na tela
    // 'getByRole("heading", { name: /Entrar/i })': busca acessível pelo título da seção
    await expect(page.getByRole('main').getByRole('heading', { name: /Entrar/i })).toBeVisible();

    // 3. Preenche o campo de e-mail com um usuário válido cadastrado no sistema
    await page.locator('input[type="email"]').fill(testUser.email);

    // 4. Preenche o campo de senha com a senha correta
    await page.locator('input[type="password"]').fill(testUser.password);

    // 5. Clica no botão de submeter o formulário de login
    await page.locator('form button[type="submit"]').click();

    // 6. Aguarda o redirecionamento para a página inicial ('/') em até 10 segundos
    await page.waitForURL('/', { timeout: 10000 });

    // 7. Confirma que a URL atual é a página inicial da aplicação
    expect(page.url()).toContain('localhost:3000');
  });

  // ─────────────────────────────────────────────────────────
  // TESTE 2: Login com senha incorreta
  // ─────────────────────────────────────────────────────────
  test('deve exibir mensagem de erro ao digitar senha incorreta', async ({ page }) => {
    // 1. Acessa a página de login
    await page.goto('/signin');

    // 2. Preenche com e-mail cadastrado, mas digita uma senha errada propositalmente
    await page.locator('input[type="email"]').fill(testUser.email);
    await page.locator('input[type="password"]').fill('Outra@123');

    // 3. Clica para tentar autenticar
    await page.locator('form button[type="submit"]').click();

    // 4. Localiza no DOM a mensagem de alerta/erro retornada pelo frontend
    // Regex que aceita diferentes variações de texto de erro para resiliência do teste
    const mensagemErro = page.locator('main').locator('text=/senha inválida|senha incorreta|credenciais inválidas|erro/i');

    // 5. Valida que a mensagem de erro está visível na tela para o usuário
    await expect(mensagemErro.first()).toBeVisible({ timeout: 5000 });
  });

  // ─────────────────────────────────────────────────────────
  // TESTE 3: Redirecionamento para cadastro
  // ─────────────────────────────────────────────────────────
  test('deve navegar para a página de cadastro ao clicar no link de cadastro', async ({ page }) => {
    // 1. Acessa a página de login
    await page.goto('/signin');

    // 2. Localiza o botão/link 'Criar conta' disponível para novos usuários
    const linkCadastro = page.locator('main').getByRole('button', { name: /Criar conta/i });

    // 3. Valida se o botão/link está visível
    await expect(linkCadastro).toBeVisible();

    // 4. Clica no link para ir para a tela de cadastro
    await linkCadastro.click();

    // 5. Aguarda a rota mudar para '/signup'
    await page.waitForURL('/signup', { timeout: 5000 });

    // 6. Asserção final: confirma que a URL atual contém '/signup'
    expect(page.url()).toContain('/signup');
  });
});
