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

## Como rodar

Instale as dependências:
npm install

Subir containers
docker compose up -d

Parar containers
docker compose down

Verificar containers ativos
docker ps

Acessar o banco Postgres dentro do container
docker exec -it disparador_postgres psql -U postgres

📌 Portas mapeadas:

Postgres → localhost:55432

Redis → localhost:6379

🗄️ Banco de Dados (Sequelize CLI)
Rodar migrations
npx sequelize-cli db:migrate

Desfazer última migration
npx sequelize-cli db:migrate:undo

Resetar todas migrations
npx sequelize-cli db:migrate:undo:all && npx sequelize-cli db:migrate

Rodar seeds (se houver)
npx sequelize-cli db:seed:all

▶️ Rodando a aplicação
npm run dev


A aplicação estará disponível em:

http://localhost:3000

🛠️ Comandos úteis
Remover containers travados
docker rm -f disparador_postgres disparador_redis

Ver logs de um serviço
docker logs -f disparador_postgres

## ⚙️ Configuração do ambiente

1. Clone o repositório:
   ```bash
   git clone https://github.com/SEU-USUARIO/disparador_de_webhooks.git
   cd disparador_de_webhooks/backend