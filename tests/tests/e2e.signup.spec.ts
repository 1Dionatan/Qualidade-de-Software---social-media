import { test, expect } from '@playwright/test';

test.describe('Fluxo de Cadastro (Sign Up)', () => {

  // ─────────────────────────────────────────────────────────
  // TESTE 1: Cadastro com sucesso
  // ─────────────────────────────────────────────────────────
  test('deve cadastrar um novo usuário com sucesso', async ({ page }) => {
    // 1. Navega até a página de cadastro (/signup)
    await page.goto('/signup');

    // 2. Valida se o título principal da página renderizou corretamente
    // 'getByRole("main")': restringe a busca à tag <main>
    // 'getByRole("heading", { name: /Criar Conta/i })': busca o cabeçalho <h1> ou <h2> com texto "Criar Conta"
    await expect(page.getByRole('main').getByRole('heading', { name: /Criar Conta/i })).toBeVisible();

    // 3. Gera um e-mail dinâmico e único usando timestamp milissegundos (Date.now())
    // Isso garante idempotência: o teste pode rodar centenas de vezes sem falhar por "e-mail já cadastrado"
    const uniqueEmail = `test_${Date.now()}@example.com`;

    // 4. Preenche os campos do formulário
    // Localiza o campo de e-mail e preenche com o e-mail único gerado
    await page.locator('input[type="email"]').fill(uniqueEmail);

    // '.first()': localiza o primeiro input de senha (campo "Senha") e digita
    await page.locator('input[type="password"]').first().fill('Senha@123');

    // '.nth(1)': localiza o segundo input de senha (índice 1, campo "Confirmar Senha") e digita
    await page.locator('input[type="password"]').nth(1).fill('Senha@123');

    // 5. Clica no botão de submissão do formulário ("Criar conta" / "Cadastrar")
    await page.locator('form button[type="submit"]').click();

    // 6. Aguarda o redirecionamento automático para a Home ('/') após o cadastro com sucesso
    await page.waitForURL('/', { timeout: 10000 });

    // 7. Valida se a URL final contém o endereço da aplicação local (localhost:3000)
    expect(page.url()).toContain('localhost:3000');
  });

  // ─────────────────────────────────────────────────────────
  // TESTE 2: Tentativa de cadastro com e-mail já existente
  // ─────────────────────────────────────────────────────────
  test('deve exibir erro ao tentar cadastrar com e-mail duplicado', async ({ page, request }) => {
    // 1. Acessa a página de cadastro
    await page.goto('/signup');

    // 2. Usa um e-mail que SABEMOS que já existe no banco de dados (MySQL)
    const emailExistente = `duplicado_${Date.now()}@example.com`;
    const cadastroInicial = await request.post('http://localhost:8080/auth/signup', {
      data: { email: emailExistente, password: 'Senha@123' },
    });
    expect(cadastroInicial.status()).toBe(200);

    // 3. Preenche o formulário com o e-mail repetido
    await page.locator('input[type="email"]').fill(emailExistente);
    await page.locator('input[type="password"]').first().fill('Senha@123');
    await page.locator('input[type="password"]').nth(1).fill('Senha@123');

    // 4. Submete o formulário
    await page.locator('form button[type="submit"]').click();

    // 5. Localiza a mensagem de erro que o frontend exibe na tela
    // 'text=/email|já cadastrado|já existe|erro/i': Regex que busca texto indicando duplicidade ou erro
    const mensagemErro = page.locator('main').locator('text=/email|já cadastrado|já existe|erro/i');

    // 6. 'toBeVisible': valida se a mensagem de erro realmente apareceu para o usuário em até 5 segundos
    await expect(mensagemErro.first()).toBeVisible({ timeout: 5000 });
  });

  // ─────────────────────────────────────────────────────────
  // TESTE 3: Validação de formulário sem preencher os campos
  // ─────────────────────────────────────────────────────────
  test('deve exibir erros de validação ao submeter formulário vazio', async ({ page }) => {
    // 1. Acessa a página de cadastro
    await page.goto('/signup');

    // 2. Clica diretamente no botão de submit sem digitar nada nos campos
    await page.locator('form button[type="submit"]').click();

    // 3. Procura no DOM mensagens de validação (ex: "Campo obrigatório")
    const campoObrigatorio = page.locator('main').locator('text=/obrigat/i');

    // 4. Valida se os avisos de obrigatoriedade foram exibidos na tela
    await expect(campoObrigatorio.first()).toBeVisible({ timeout: 3000 });
  });
});
