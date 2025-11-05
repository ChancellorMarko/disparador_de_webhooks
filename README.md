# 🚀 Disparador de Webhooks API

API robusta desenvolvida em **Node.js + Express** para o reenvio e gerenciamento de notificações de webhooks. O projeto utiliza **Sequelize** como ORM para o **PostgreSQL**, implementa um sistema de cache com **Redis** e possui dupla camada de autenticação com **JWT** (para rotas de gerenciamento) e tokens estáticos (para a rota principal de reenvio).

Este foi um projeto acadêmico para a disciplina de Desenvolvimento de Webservices e API.

---

## 📜 Tabela de Conteúdos

- [📌 Sobre o Projeto](#-sobre-o-projeto)
- [🛠️ Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [⚙️ Pré-requisitos](#️-pré-requisitos)
- [🚀 Instalação e Configuração](#-instalação-e-configuração)
  - [Com Docker (Recomendado)](#opção-1-usando-docker-recomendado)
  - [Manualmente (Local)](#opção-2-rodando-localmente-passo-a-passo)
- [✅ Fluxo de Teste Completo (End-to-End)](#-fluxo-de-teste-completo-end-to-end)
- [🐳 Comandos Úteis do Docker](#-comandos-úteis-do-docker)

---

## 📌 Sobre o Projeto

O objetivo principal deste projeto é fornecer uma API segura e performática que permita reenviar notificações de webhook que possam ter falhado. A API gerencia uma hierarquia de entidades (Software House → Cedente → Conta → Convênio → Serviço) e aplica regras de negócio complexas, como:

- **Autenticação Dupla:** Rotas de setup são protegidas por JWT, enquanto a rota de disparo utiliza um middleware de autenticação (`shAuth`) com headers estáticos (`x-api-*`).
- **Validação de Dados:** Validação rigorosa dos dados de entrada em todas as rotas.
- **Sistema de Cache com Redis:** Para otimizar a performance e evitar o processamento de requisições duplicadas.
- **Lógica de Negócio Específica:** Montagem de payloads de webhook dinâmicos e customizados para diferentes tipos de produtos (Boleto, Pagamento, Pix).

---

## 🛠️ Tecnologias Utilizadas

- **Backend:** Node.js, Express.js
- **Banco de Dados:** PostgreSQL
- **ORM:** Sequelize
- **Cache:** Redis
- **Autenticação:** JWT (jsonwebtoken)
- **Requisições HTTP:** Axios
- **Validação:** Joi
- **Ambiente:** Docker, Dotenv

---

## ⚙️ Pré-requisitos

Antes de começar, garanta que você tenha os seguintes softwares instalados:

- [Node.js](https://nodejs.org/) (versão 22.x ou superior)
- [PostgreSQL](https://www.postgresql.org/) (versão 14 ou superior)
- [Redis](https://redis.io/) (versão 7 ou superior)
- [Docker + Docker Compose](https://www.docker.com/) *(opcional, mas altamente recomendado)*

---

## 🚀 Instalação e Configuração
## Objetivos

- Centralizar disparo de notificações webhooks.
- Garantir retries e registro de histórico.
- Permitir configuração por conta/cedente (URL e headers).
- Fornecer endpoints para envio manual, reenvio e consulta de histórico.

---

## Arquitetura e fluxos

1. Eventos geram registros em `WebhookReprocessado` no banco com status `pendente`.
2. `WebhookDispatcherService.processarFila()` (worker) busca webhooks pendentes e processa cada um:
   - Obtém configuração (conta → cedente).
   - Monta payload específico por produto (`boleto`, `pagamento`, `pix`).
   - Envia para a URL configurada com headers apropriados.
   - Marca como `enviado` ou `falhou` e registra erro.
3. `WebhookService` gerencia envios manuais/automáticos, persiste webhooks, adiciona assinatura HMAC quando configurada e executa retry com backoff exponencial (até 3 tentativas).

Observações:
- O worker é executado usando `setInterval` a cada 5 minutos e é disparado no startup da aplicação.
- Em ambientes com múltiplas instâncias, recomenda‑se migrar para uma fila robusta (Bull, RabbitMQ) para evitar processamento duplicado.

---

## Endpoints (resumo)

As rotas de API ficam sob `/api` e requerem JWT (exceto as de autenticação).

- POST /api/auth/login — Autenticação da Software House
  - Body: { cnpj, senha }
  - Retorna: accessToken (JWT) e dados da software house.

- GET /api/auth/me — Obter dados da Software House (Bearer token)

Webhooks:
- POST /api/webhooks/enviar — Envia webhook manualmente
  - Body (exemplo): { protocolo_id, evento, dados }
  - Retorno: { success, message, data }

- POST /api/webhooks/reenviar/:id — Reenvia webhook por id

- GET /api/webhooks/historico/:protocolo_id — Histórico de webhooks por protocolo

Reenvio em massa (fluxo de teste):
- POST /api/reenviar — usado para fluxo de reenvio em massa; veja `README.md` raiz para checklist de testes.

Entidades relacionadas (rotas usadas no fluxo): `/api/cedentes`, `/api/contas`, `/api/convenios`, `/api/servicos`.

---

## Payload e assinatura

- O payload final é montado por `WebhookDispatcherService._montarPayloadFinal(...)` e possui a forma:

```
{
  notifications: [
    {
      kind: "webhook",
      method: "POST",
      url: "...",
      headers: "...",
      body: { ... } // estrutura específica por produto
    }
  ]
}
```

- Quando `webhook_secret` estiver configurado, o header `X-Webhook-Signature` (HMAC SHA-256) é adicionado ao envio sobre o JSON do body.

---

## Retry e tolerância a falhas

- Retries implementados em `WebhookService.retry` com backoff exponencial: delay = 2^(tentativas) * 1000 ms.
- Limite de tentativas: 3. Ao atingir o limite, o registro permanece em erro e, dependendo da lógica, a configuração de webhook da software house pode ser desativada.

---

## Variáveis de ambiente (principais)

Checar `.env.example` para a lista completa. Principais:
- PORT — porta da aplicação (padrão: 3000)
- NODE_ENV — ambiente (development/production/test)
- DATABASE_URL ou DB_HOST/DB_USER/DB_PASS/DB_NAME — configuração do Postgres
- REDIS_URL ou REDIS_HOST/REDIS_PORT — Redis
- JWT_SECRET — chave do JWT
- RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS — rate limiting
- ALLOWED_ORIGINS — origens permitidas para CORS

---

## 🚀 Instalação e Configuração
## Objetivos

- Centralizar disparo de notificações webhooks.
- Garantir retries e registro de histórico.
- Permitir configuração por conta/cedente (URL e headers).
- Fornecer endpoints para envio manual, reenvio e consulta de histórico.

---

## Arquitetura e fluxos

1. Eventos geram registros em `WebhookReprocessado` no banco com status `pendente`.
2. `WebhookDispatcherService.processarFila()` (worker) busca webhooks pendentes e processa cada um:
   - Obtém configuração (conta → cedente).
   - Monta payload específico por produto (`boleto`, `pagamento`, `pix`).
   - Envia para a URL configurada com headers apropriados.
   - Marca como `enviado` ou `falhou` e registra erro.
3. `WebhookService` gerencia envios manuais/automáticos, persiste webhooks, adiciona assinatura HMAC quando configurada e executa retry com backoff exponencial (até 3 tentativas).

Observações:
- O worker é executado usando `setInterval` a cada 5 minutos e é disparado no startup da aplicação.
- Em ambientes com múltiplas instâncias, recomenda‑se migrar para uma fila robusta (Bull, RabbitMQ) para evitar processamento duplicado.

---

## Endpoints (resumo)

As rotas de API ficam sob `/api` e requerem JWT (exceto as de autenticação).

- POST /api/auth/login — Autenticação da Software House
  - Body: { cnpj, senha }
  - Retorna: accessToken (JWT) e dados da software house.

- GET /api/auth/me — Obter dados da Software House (Bearer token)

Webhooks:
- POST /api/webhooks/enviar — Envia webhook manualmente
  - Body (exemplo): { protocolo_id, evento, dados }
  - Retorno: { success, message, data }

- POST /api/webhooks/reenviar/:id — Reenvia webhook por id

- GET /api/webhooks/historico/:protocolo_id — Histórico de webhooks por protocolo

Reenvio em massa (fluxo de teste):
- POST /api/reenviar — usado para fluxo de reenvio em massa; veja `README.md` raiz para checklist de testes.

Entidades relacionadas (rotas usadas no fluxo): `/api/cedentes`, `/api/contas`, `/api/convenios`, `/api/servicos`.

---

## Payload e assinatura

- O payload final é montado por `WebhookDispatcherService._montarPayloadFinal(...)` e possui a forma:

```
{
  notifications: [
    {
      kind: "webhook",
      method: "POST",
      url: "...",
      headers: "...",
      body: { ... } // estrutura específica por produto
    }
  ]
}
```

- Quando `webhook_secret` estiver configurado, o header `X-Webhook-Signature` (HMAC SHA-256) é adicionado ao envio sobre o JSON do body.

---

## Retry e tolerância a falhas

- Retries implementados em `WebhookService.retry` com backoff exponencial: delay = 2^(tentativas) * 1000 ms.
- Limite de tentativas: 3. Ao atingir o limite, o registro permanece em erro e, dependendo da lógica, a configuração de webhook da software house pode ser desativada.

---

## Variáveis de ambiente (principais)

Checar `.env.example` para a lista completa. Principais:
- PORT — porta da aplicação (padrão: 3000)
- NODE_ENV — ambiente (development/production/test)
- DATABASE_URL ou DB_HOST/DB_USER/DB_PASS/DB_NAME — configuração do Postgres
- REDIS_URL ou REDIS_HOST/REDIS_PORT — Redis
- JWT_SECRET — chave do JWT
- RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS — rate limiting
- ALLOWED_ORIGINS — origens permitidas para CORS

---

## ⚙️ Como Rodar e Configurar

Siga uma das opções abaixo para rodar o projeto.

### Opção 1: Usando Docker (Recomendado)

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/SEU-USUARIO/disparador_de_webhooks.git](https://github.com/SEU-USUARIO/disparador_de_webhooks.git)
    cd disparador_de_webhooks/backend
    ```
2.  **Crie e configure o arquivo `.env`** a partir do exemplo `.env.example`.
3.  **Suba os containers** do Postgres, Redis e da Aplicação:
    ```bash
    docker compose up -d
    ```
A API estará disponível em `http://localhost:3000`.

### Opção 2: Rodando Localmente (Passo a Passo)

1.  **Clone o repositório** e navegue até a pasta `backend`.

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Crie e configure o arquivo `.env`** a partir do `.env.example`, preenchendo suas credenciais do banco de dados, Redis e a chave secreta do JWT.

4.  **Prepare o Banco de Dados com Sequelize:**

    ⚠️ **Atenção:** Os comandos abaixo irão apagar e recriar o banco de dados.

    ```bash
    # 1. Apaga o banco de dados (se existir)
    npx sequelize-cli db:drop

    # 2. Cria o banco de dados novamente
    npx sequelize-cli db:create

    # 3. Executa as migrations para criar as tabelas
    npx sequelize-cli db:migrate

    # 4. Popula o banco com dados iniciais (seeders)
    npx sequelize-cli db:seed:all
    ```

5.  **Inicie a aplicação em modo de desenvolvimento:**
    ```bash
    npm run dev
    ```
    A API estará disponível em `http://localhost:3000`.

---

## ✅ Fluxo de Teste Completo (End-to-End)

Este guia simula um fluxo completo, desde a criação dos dados até o disparo do webhook.

### Passo 1: Autenticação da Software House e Setup

#### a) Fazer Login na Software House
- **Método:** `POST`
- **URL:** `http://localhost:3000/api/auth/login`
- **Body:**
  ```json
  {
    "cnpj": "11222333000144",
    "senha": "senha123"
  }

## Ação: Copie o accessToken da resposta. Ele será usado para cadastrar as entidades seguintes.

#### b) Obter Dados da Software House
- **Método:** `GET`

- **URL:** `http://localhost:3000/api/auth/me`

## Autenticação: Use o accessToken como Bearer Token.

## Ação: Copie o cnpj e o token (estático) da resposta. Guarde-os para o Passo 3.

### Passo 2: Cadastro de Entidades
#### a) Criar um Cedente
- **Método:** `POST`

- **URL:** `http://localhost:3000/api/cedentes`

## Autenticação: Use o accessToken como Bearer Token.

**Body:**

`JSON`

{
  "cnpj": "98765432000199",
  "razao_social": "Empresa Cedente Teste LTDA",
  "nome_fantasia": "Cedente Teste Final",
  "email": "final@teste.com"
}
## Ação: Copie o id, cnpj e token do novo cedente.

#### b) Criar Conta, Convênio e Serviço
Siga o mesmo padrão para criar os demais itens, sempre usando o accessToken para autenticação e passando os IDs criados no passo anterior:

**POST /api/contas (requer cedente_id)**

**POST /api/convenios (requer conta_id)**

**POST /api/servicos (requer convenio_id e um status inicial, ex: "REGISTRADO")**

#### c) Configurar a URL do Webhook (Manual)
Vá em https://webhook.site/ e copie sua URL única.

Execute o SQL para atualizar a conta criada (substitua os placeholders):

`SQL`

UPDATE contas SET configuracao_notificacao = '{"url": "SUA_URL_DO_WEBHOOK.SITE_AQUI"}' WHERE id = <ID_DA_CONTA>;
Passo 3: Disparo do Webhook de Reenvio
Esta é a rota principal e utiliza a autenticação com headers estáticos.

**Método:** `POST`

**URL:** `http://localhost:3000/api/reenviar`

## Headers (Obrigatórios):

x-api-cnpj-sh: (CNPJ da Software House do Passo 1b)

x-api-token-sh: (Token estático da Software House do Passo 1b)

x-api-cnpj-cedente: (CNPJ do Cedente do Passo 2a)

x-api-token-cedente: (Token do Cedente do Passo 2a)

Body: (Substitua <ID_DO_SERVICO> pelo id do serviço criado)

`JSON`

{
  "product": "boleto",
  "id": ["<ID_DO_SERVICO>"],
  "kind": "webhook",
  "type": "disponivel"
}
#### Resultados Esperados:

**Postman: Resposta 201 Created com o UUID do protocolo.**

**Terminal: Logs do disparador rodando e enviando o webhook.**

**Webhook.site: A notificação com o JSON completo aparece na sua URL.**

## 🐳 Comandos Úteis do Docker
Parar todos os containers: docker compose down

Verificar containers em execução: docker ps

Acessar o terminal do Postgres: docker exec -it disparador_postgres psql -U postgres

Ver logs de um serviço: docker logs -f disparador_backend