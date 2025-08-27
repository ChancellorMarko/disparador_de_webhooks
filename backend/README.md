# Backend - Disparador de Webhooks

## Descrição
API para reenvio de notificações de webhook do PlugBoleto que não foram entregues corretamente.

## Tecnologias
- Node.js
- Express.js
- PostgreSQL
- Sequelize (ORM)
- Redis (Cache)
- JWT (Autenticação)
- Joi (Validação)
- Jest (Testes)

## Estrutura do Projeto
```
backend/
├── src/
│   ├── models/          # Modelos do Sequelize
│   ├── controllers/     # Controladores da API
│   ├── services/        # Lógica de negócio
│   ├── middlewares/     # Middlewares (auth, validation, error handling)
│   ├── routes/          # Definição das rotas
│   ├── config/          # Configurações (database, redis)
│   ├── utils/           # Utilitários e constantes
│   └── app.js          # Arquivo principal da aplicação
├── migrations/          # Migrações do banco de dados
├── tests/              # Testes unitários e de integração
└── package.json        # Dependências do projeto
```

## Instalação
1. Clone o repositório
2. Instale as dependências: `npm install`
3. Configure as variáveis de ambiente
4. Execute as migrações: `npm run migrate`
5. Inicie o servidor: `npm start`

## Rotas Principais
- `POST /reenviar` - Reenvio de webhooks
- `GET /protocolo` - Listagem de protocolos
- `GET /protocolo/:uuid` - Consulta individual de protocolo
