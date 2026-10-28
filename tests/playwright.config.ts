// Importa a função 'defineConfig' (para definir as configurações do Playwright)
// e 'devices' (lista de dispositivos pré-configurados como Chrome, Firefox, etc.)
import { defineConfig, devices } from '@playwright/test';

// Exporta a configuração padrão do Playwright usando 'defineConfig'
// Todos os parâmetros aqui controlam o comportamento global dos testes
export default defineConfig({

  // 'testDir' informa ao Playwright onde estão os arquivos de teste (.spec.ts)
  // Todos os arquivos dentro da pasta './tests' serão descobertos e executados
  testDir: './tests',

  // 'fullyParallel: true' faz os testes rodarem em paralelo (ao mesmo tempo)
  // Isso acelera a execução quando há muitos testes
  fullyParallel: true,

  // 'forbidOnly' impede que testes com .only sejam publicados em CI (Integração Contínua)
  // Isso evita que um desenvolvedor acidentalmente deixe um test.only no código
  forbidOnly: !!process.env.CI,

  // 'retries' define quantas vezes um teste com falha será repetido automaticamente
  // No CI (ambiente automatizado) repete 2x; localmente, não repete (0)
  retries: process.env.CI ? 2 : 0,

  // 'workers' controla quantos testes rodam ao mesmo tempo (em paralelo)
  // No CI usa apenas 1 para evitar conflitos; localmente usa o padrão automático
  workers: process.env.CI ? 1 : undefined,

  // 'reporter' define o formato do relatório de resultados dos testes
  // 'html' gera um relatório em HTML navegável (aberto com: npx playwright show-report)
  reporter: 'html',

  // 'use' define configurações compartilhadas por todos os testes
  use: {
    // 'baseURL' é a URL base do frontend (Next.js)
    // Ao usar page.goto('/signin'), o Playwright vai para http://localhost:3000/signin
    baseURL: 'http://localhost:3000',

    // 'trace' coleta um rastreio detalhado das ações do teste quando ele falha
    // 'on-first-retry' significa: grava o trace apenas na primeira tentativa de reexecução
    trace: 'on-first-retry',

    // 'screenshot' tira uma captura de tela quando o teste falha
    // Útil para depurar o que estava na tela no momento da falha
    screenshot: 'only-on-failure',

    // 'video' grava um vídeo do teste quando ele falha
    // Permite ver exatamente o que aconteceu passo a passo
    video: 'retain-on-failure',
  },

  // 'projects' define em quais navegadores/dispositivos os testes serão executados
  // Cada projeto pode ter configurações diferentes (ex: tamanho de tela, agente)
  projects: [
    {
      // Nome do projeto (aparece nos relatórios)
      name: 'chromium',

      // 'use' define que esse projeto usa as configurações do Desktop Chrome
      // '...devices['Desktop Chrome']' é um spread que copia width=1280px, height=720px, etc.
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
