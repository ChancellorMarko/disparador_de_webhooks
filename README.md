# 🚀 Disparador de Webhooks API

API desenvolvida em **Node.js + Express**, utilizando **Sequelize**, **Postgres**, **Redis** e autenticação com **JWT**.
Projeto acadêmico do 4° semestre – Desenvolvimento de Webservices e API.

---

## 📌 Pré-requisitos

Antes de rodar o projeto, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão **22.x** ou próxima)
- [PostgreSQL](https://www.postgresql.org/) (14 ou superior)
- [Redis](https://redis.io/) (7 ou superior)
- [Docker + Docker Compose](https://www.docker.com/) *(opcional, mas recomendado)*

---

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

Você pode rodar o projeto usando Docker (recomendado) ou manualmente na sua máquina.

### Opção 1: Usando Docker (Recomendado)

1.  **Clone o repositório** e entre na pasta do backend.
2.  **Crie e configure seu arquivo `.env`** a partir do `.env.example`.
3.  **Suba os containers** do Postgres, Redis e da Aplicação com um único comando:
    ```bash
    docker compose up -d
    ```
A aplicação estará disponível em `http://localhost:3000`.

### Opção 2: Rodando Localmente (Passo a Passo)

1.  **Clone o repositório**
    ```bash
    git clone [https://github.com/ChancellorMarko/disparador_de_webhooks.git](https://github.com/ChancellorMarko/disparador_de_webhooks.git)
    ```

2.  **Navegue até a pasta do backend**
    ```bash
    cd disparador_de_webhooks/backend
    ```

3.  **Instale as dependências**
    ```bash
    npm install
    ```

4.  **Crie e configure o arquivo de ambiente (`.env`)**
    Copie o arquivo de exemplo `.env.example` para `.env` e preencha com suas credenciais do banco de dados, Redis e a chave secreta do JWT.

5.  **Prepare o Banco de Dados (Sequelize)**

    ⚠️ **Atenção:** Os comandos abaixo irão apagar e recriar seu banco de dados do zero.

    Execute a sequência completa no terminal:
    ```bash
    # 1. Apaga o banco de dados (se existir)
    npx sequelize-cli db:drop

    # 2. Cria o banco de dados vazio novamente
    npx sequelize-cli db:create

    # 3. Cria todas as tabelas com a estrutura correta
    npx sequelize-cli db:migrate

    # 4. Popula o banco com os dados de teste iniciais (Software House)
    npx sequelize-cli db:seed:all
    ```

6.  **Inicie a aplicação**
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em `http://localhost:3000`.

---

## 🛠️ Comandos Úteis

* **Parar containers Docker:** `docker compose down`
* **Verificar containers ativos:** `docker ps`
* **Acessar o psql dentro do container:** `docker exec -it disparador_postgres psql -U postgres`
* **Ver logs de um serviço Docker:** `docker logs -f disparador_postgres`

---

## ✅ Fluxo de Teste Completo (End-to-End)

Este guia simula um fluxo completo, desde a criação dos dados até o disparo do webhook para um endpoint de teste (ex.: `webhook.site` ou Beeceptor).

### Passo 1: Autenticação da Software House e setup

#### a) Fazer Login na Software House

- Método: `POST`
- URL: `http://localhost:3000/api/auth/login`
- Body (JSON):

```json
{
  "cnpj": "11222333000144",
  "senha": "senha123"
}
```

Ação: copie o `accessToken` da resposta. Ele será usado para as próximas requisições.

#### b) Obter dados da Software House

- Método: `GET`
- URL: `http://localhost:3000/api/auth/me`
- Auth: Bearer `<accessToken>`

Ação: copie o `cnpj` e o `token` (token estático) da resposta. Guarde-os para o Passo 3.

### Passo 2: Cadastro de Entidades (com configuração automatizada)

#### a) Criar um Cedente

- Método: `POST`
- URL: `http://localhost:3000/api/cedentes`
- Auth: Bearer `<accessToken>`
- Body (JSON):

```json
{
  "cnpj": "98765432000199",
  "razao_social": "Empresa Cedente Teste LTDA",
  "nome_fantasia": "Cedente Teste Final",
  "email": "final@teste.com"
}
```

Ação: copie o `id`, `cnpj` e `token` do cedente criado.

#### b) Criar Conta (incluindo a URL do Webhook)

- Método: `POST`
- URL: `http://localhost:3000/api/contas`
- Auth: Bearer `<accessToken>`
- Body (JSON): substitua `<ID_DO_CEDENTE>` e a URL do seu endpoint de teste:

```json
{
  "produto": "boleto",
  "banco_codigo": "341",
  "status": "ativo",
  "cedente_id": <ID_DO_CEDENTE>,
  "configuracao_notificacao": {
    "url": "https://SEU_ENDPOINT.free.beeceptor.com"
  }
}
```

Ação: copie o `id` da nova conta.

#### c) Criar Convênio e Serviço

- POST `/api/convenios` (Body com `conta_id` = id da conta criada) — copie o `id` do convênio.
- POST `/api/servicos` (Body com `convenio_id` = id do convênio e `status` inicial, ex.: `"REGISTRADO"`) — copie o `id` do serviço.

### Passo 3: Disparo do Webhook de Reenvio

Esta rota realiza o reenvio em massa e utiliza autenticação por headers estáticos (usados no fluxo de testes).

- Método: `POST`
- URL: `http://localhost:3000/api/reenviar`
- Headers obrigatórios:
  - `x-api-cnpj-sh`: CNPJ da Software House (do Passo 1)
  - `x-api-token-sh`: token estático da Software House (do Passo 1)
  - `x-api-cnpj-cedente`: CNPJ do Cedente (do Passo 2a)
  - `x-api-token-cedente`: token do Cedente (do Passo 2a)

- Body (JSON) — substitua `<ID_DO_SERVICO>` pelo id criado no Passo 2c:

```json
{
  "product": "boleto",
  "id": ["<ID_DO_SERVICO>"],
  "kind": "webhook",
  "type": "disponivel"
}
```

Resultados esperados:

- No Postman / resposta HTTP: `201 Created` com um novo `protocolo` (UUID).
- No terminal do servidor: o worker deve processar a fila e imprimir logs como "Buscando webhooks...", "Disparando webhook..." e "enviado com sucesso".
- No Beeceptor / webhook.site: a notificação com o JSON configurado deve aparecer na URL que você configurou em `configuracao_notificacao`.

Observações e dicas:

- Se preferir testar manualmente sem criar todas as entidades via API, você pode inserir a `configuracao_notificacao` diretamente no banco usando um `UPDATE` na tabela `contas`.
- Verifique os logs em `backend/logs/combined.log` para detalhes de erro quando ocorrerem falhas no envio.

## ⚙️ Configuração do ambiente

1. Clone o repositório:
   ```bash
   git clone https://github.com/SEU-USUARIO/disparador_de_webhooks.git
   cd disparador_de_webhooks/backend