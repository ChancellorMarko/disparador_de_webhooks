# Guia de Testes - Software House API

Este documento descreve a estrutura de testes implementada para a API de Software Houses.

## Estrutura de Testes

### Testes Unitários
Localizados em `__tests__/unit/`, testam funções isoladas:

- **Middlewares de Validação** (`middlewares/validation.test.js`)
  - Validação de headers obrigatórios
  - Validação de formato CNPJ e Token SH
  - Geração de correlation IDs

- **Serviços de Autenticação** (`services/AuthenticationService.test.js`)
  - Geração e verificação de tokens JWT
  - Gerenciamento de refresh tokens
  - Conversão de tempo para segundos

- **Utilitários de Validação** (`utils/validators.test.js`)
  - Funções puras de validação
  - Formatação e verificação de dados

### Testes de Integração
Localizados em `__tests__/integration/`, testam rotas completas:

- **Rotas de Protocolo** (`routes/protocolo.test.js`)
  - CRUD completo de protocolos
  - Autenticação e autorização
  - Respostas da API

## Comandos Disponíveis

\`\`\`bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar apenas testes unitários
npm run test:unit

# Executar apenas testes de integração
npm run test:integration

# Gerar relatório de cobertura
npm run test:coverage
\`\`\`

## Configuração

### Jest
- Configurado para ambiente Node.js
- Timeout de 10 segundos para testes assíncronos
- Cobertura mínima de 80% em todas as métricas
- Limpeza automática de mocks entre testes

### Mocks
- AuthenticationService mockado para testes de middleware
- Redis client mockado para testes de serviços
- Console mockado para evitar logs durante testes

## Estrutura de Arquivos

\`\`\`
__tests__/
├── setup/
│   └── testSetup.js          # Configurações globais
├── unit/
│   ├── middlewares/
│   │   └── validation.test.js
│   ├── services/
│   │   └── AuthenticationService.test.js
│   └── utils/
│       └── validators.test.js
└── integration/
    └── routes/
        └── protocolo.test.js
\`\`\`

## Boas Práticas

1. **Isolamento**: Cada teste é independente
2. **Mocking**: Dependências externas são mockadas
3. **Cobertura**: Mantém cobertura mínima de 80%
4. **Nomenclatura**: Testes descritivos e organizados
5. **Setup/Teardown**: Limpeza adequada entre testes

## Executando os Testes

1. Instale as dependências:
\`\`\`bash
npm install
\`\`\`

2. Execute os testes:
\`\`\`bash
npm test
\`\`\`

3. Visualize a cobertura:
\`\`\`bash
npm run test:coverage
\`\`\`

O relatório de cobertura será gerado em `coverage/lcov-report/index.html`.
