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

## ✅ Checklist de Teste Completo (Do Zero ao Reenvio)

Sim, tudo perfeito! O log mostra que o servidor está 100% pronto e esperando. O "Nenhum webhook pendente encontrado" é a prova de que o disparador está funcionando e a fila está limpa.

Agora vamos para a missão final: o teste completo de ponta a ponta. Siga este guia com atenção, copiando os dados de uma etapa para a outra.

Checklist de Teste Completo (Do Zero ao Reenvio)
🚀 Missão 1: Login e Obtenção de Chaves
a) Fazer Login na Software House

Método: POST

URL: http://localhost:3000/api/auth/login

Body (raw/JSON):

JSON

{
  "cnpj": "11222333000144",
  "senha": "senha123"
}
Ação: A resposta será 200 OK. Copie o accessToken que você receber.

b) Obter Dados da Software House

Método: GET

URL: http://localhost:3000/api/auth/me

Auth: Vá na aba Authorization, selecione Bearer Token e cole o accessToken do passo anterior.

Ação: A resposta será 200 OK. Copie o token estático (o que não é o JWT) e o cnpj da resposta. Guarde-os, vamos usá-los como token-sh e cnpj-sh no final.

📝 Missão 2: Cadastrar a Hierarquia de Dados
a) Criar um Cedente

Método: POST

URL: http://localhost:3000/api/cedentes

Auth: Use o mesmo accessToken como Bearer Token.

Body (raw/JSON):

JSON

{
  "cnpj": "98765432000199",
  "razao_social": "Empresa Cedente Teste LTDA",
  "nome_fantasia": "Cedente Teste Final",
  "email": "final@teste.com"
}
Ação: A resposta será 201 Created. Copie o id, o cnpj e o token do novo cedente da resposta.

b) Criar uma Conta

Método: POST

URL: http://localhost:3000/api/contas

Auth: Use o accessToken.

Body (raw/JSON): (Substitua <ID_DO_CEDENTE> pelo id que você copiou no passo anterior)

JSON

{
  "produto": "boleto",
  "banco_codigo": "341",
  "status": "ativo",
  "cedente_id": <ID_DO_CEDENTE>
}
Ação: A resposta será 201 Created. Copie o id da nova conta.

c) Configurar a URL do Webhook (Passo Manual)

Vá em https://webhook.site/ e copie a sua URL única.

Use o psql ou sua ferramenta de banco de dados para executar o comando SQL, usando o id da conta que você acabou de criar:

SQL

UPDATE contas SET configuracao_notificacao = '{"url": "SUA_URL_DO_WEBHOOK.SITE_AQUI"}' WHERE id = <ID_DA_CONTA>;
d) Criar um Convênio

Método: POST

URL: http://localhost:3000/api/convenios

Auth: Use o accessToken.

Body (raw/JSON): (Substitua <ID_DA_CONTA> pelo id da conta)

JSON

{
  "numero_convenio": "7654321",
  "conta_id": <ID_DA_CONTA>
}
Ação: Resposta 201 Created. Copie o id do novo convênio.

e) Criar um Serviço (o "Boleto")

Método: POST

URL: http://localhost:3000/api/servicos

Auth: Use o accessToken.

Body (raw/JSON): (Substitua <ID_DO_CONVENIO> pelo id do convênio)

JSON

{
  "status": "REGISTRADO",
  "convenio_id": <ID_DO_CONVENIO>
}
Ação: Resposta 201 Created. Copie o id do novo serviço.

📡 Missão 3: O Teste Final do Reenvio
a) Solicitar o Reenvio

Método: POST

URL: http://localhost:3000/api/reenviar

Auth: Use o accessToken.

Headers: Adicione os 4 headers com os valores que você copiou:

cnpj-sh: (CNPJ da Software House do passo 1b)

token-sh: (Token estático da Software House do passo 1b)

cnpj-cedente: (CNPJ do Cedente do passo 2a)

token-cedente: (Token do Cedente do passo 2a)

Body (raw/JSON): (Substitua <ID_DO_SERVICO> pelo id do serviço)

JSON

{
  "product": "boleto",
  "id": ["<ID_DO_SERVICO>"],
  "kind": "webhook",
  "type": "disponivel"
}
b) Observe os Resultados!

No Postman: A resposta deve ser 201 Created com um novo protocolo UUID.

No Terminal: Em até 1 minuto, o disparador deve rodar e mostrar os logs Buscando webhooks..., Disparando webhook... e enviado com sucesso.

No webhook.site: A notificação deve aparecer na página que você deixou aberta.

Se tudo isso acontecer, você finalizou e validou o fluxo completo do seu projeto. Parabéns!

## ⚙️ Configuração do ambiente

1. Clone o repositório:
   ```bash
   git clone https://github.com/SEU-USUARIO/disparador_de_webhooks.git
   cd disparador_de_webhooks/backend