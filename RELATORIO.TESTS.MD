# Relatório de Testes

Este documento detalha todos os testes criados para o projeto, organizados por unidade e integração.

## Testes Unitarios

### `middlewares/auth.test.js`

Este arquivo testa o middleware de autenticação `authenticateJWT`.

-   **`deve chamar next() e anexar dados em req.auth com um token válido`**: Garante que, com um token JWT válido, o middleware prossiga para a próxima função e anexe os dados do payload do token ao objeto `req.auth`.
-   **`deve chamar next(error) se o header de autorização estiver ausente`**: Verifica se o middleware retorna um erro de `AppError` com status 401 quando o cabeçalho `Authorization` não é fornecido na requisição.
-   **`deve chamar next(error) se o token for inválido (jwt.verify lança erro)`**: Assegura que, se o `jwt.verify` lançar um erro (indicando um token inválido), o middleware capture o erro e retorne um `AppError` com status 401.

### `utils/formatCNPJ.test.js`

Testa a função de formatação de CNPJ.

-   **`deve formatar CNPJ corretamente`**: Verifica se a função `formatCNPJ` adiciona a pontuação padrão (pontos, barra e hífen) a uma string de CNPJ que contém apenas números.
-   **`deve retornar o valor original se não for possível formatar`**: Garante que, se a entrada não for um CNPJ passível de formatação, a função a retorne sem alterações.

### `utils/formatDate.test.js`

Testa a função de formatação de datas.

-   **`deve formatar data corretamente`**: Confere se a função `formatDate` converte uma data (seja em formato de string `YYYY-MM-DD` ou objeto `Date`) para o formato `DD/MM/YYYY`.
-   **`deve retornar o valor original se não for possível formatar`**: Assegura que entradas inválidas sejam retornadas sem modificação.

### `utils/formatPhone.test.js`

Testa a função de formatação de telefone.

-   **`deve formatar telefone corretamente`**: Verifica se a função `formatPhone` converte uma string de números em um formato de telefone com parênteses e hífen.
-   **`deve retornar o valor original se não for possível formatar`**: Garante que uma entrada que não pode ser formatada seja devolvida como está.

### `utils/isValidCNPJ.test.js`

Valida a função que verifica a validade de um CNPJ.

-   **`deve retornar true para CNPJ válido`**: Testa se um número de CNPJ reconhecidamente válido passa na validação.
-   **`deve retornar false para CNPJ inválido`**: Verifica se um CNPJ com todos os dígitos iguais, que é um caso conhecido de invalidez, é corretamente identificado como falso.

### `utils/isValidDate.test.js`

Testa a função de validação de datas.

-   **`deve retornar true para data válida`**: Garante que uma string de data no formato `YYYY-MM-DD` é considerada válida.
-   **`deve retornar false para data inválida`**: Verifica se uma string que não representa uma data é corretamente invalidada.

### `utils/isValidEmail.test.js`

Valida a função que verifica a validade de um e-mail.

-   **`deve retornar true para email válido`**: Testa um formato de e-mail padrão e espera que seja considerado válido.
-   **`deve retornar false para email inválido`**: Testa um formato de e-mail incorreto e espera que seja considerado inválido.

### `utils/isValidPhone.test.js`

Testa a função de validação de telefone.

-   **`deve retornar true para telefone válido`**: Garante que um número de telefone formatado corretamente seja validado.
-   **`deve retornar false para telefone inválido`**: Assegura que uma string curta e não formatada seja invalidada.

## Testes de Integração

### `protocolo.routes.test.js`

Testa a rota `GET /api/protocolos`.

-   **`deve retornar erro 400 se o filtro start_date for obrigatório e não for fornecido`**: Garante que a rota retorne um erro 400 se o parâmetro `end_date` for fornecido sem o `start_date`.
-   **`deve retornar erro 400 se o intervalo de datas for maior que 31 dias`**: Verifica se a API impõe a regra de que o intervalo entre `start_date` e `end_date` não pode superar 31 dias.
-   **`deve retornar 200 com uma consulta válida`**: Assegura que, com os parâmetros de data corretos, a rota retorne status 200 e os dados esperados, zombando a resposta do `ProtocoloService`.

### `reenvio.routes.test.js`

Testa a rota `POST /api/reenviar`.

-   **`deve criar uma solicitação de reenvio com sucesso e retornar status 201`**: Simula uma requisição completa para o endpoint de reenvio, com todos os cabeçalhos e corpo necessários, e verifica se a resposta é um sucesso (status 201) e contém um protocolo, indicando que a solicitação foi criada.

## Configuração de Teste

### `setup/testSetup.js`

Este arquivo não contém testes, mas é crucial para o ambiente de teste.

-   **Configuração do Ambiente**: Define as variáveis de ambiente para o modo de teste, incluindo segredos JWT e URLs de banco de dados e Redis.
-   **Mock do Console**: Suprime as saídas do `console.log` e outras funções do console para manter a saída dos testes limpa.
-   **Gerenciamento do Banco de Dados**: Garante que a conexão com o banco de dados (`sequelize`) seja fechada após todos os testes, permitindo que o processo do Jest termine corretamente.
-   **Limpeza de Mocks**: Usa `beforeEach` e `afterEach` para limpar e restaurar mocks entre os testes, garantindo o isolamento de cada caso de teste.