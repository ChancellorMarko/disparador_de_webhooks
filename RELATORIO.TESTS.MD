Relatório de Cobertura de Testes Automatizados
Data do Relatório: 14/10/2025

Este documento resume a cobertura atual dos testes automatizados para o projeto disparador-webhooks-backend. O objetivo é fornecer visibilidade sobre os cenários verificados e garantir a qualidade e a estabilidade das funcionalidades implementadas.

Tabela de Cobertura por Suíte de Testes
Suíte de Testes (Ficheiro)

Tipo de Teste

Cobertura e Cenários Verificados

validators.test.js

Unitário

Validações e Formatações de Dados:

- CNPJ: Confirma a lógica de validação e formatação (XX.XXX.XXX/XXXX-XX).
- Email: Assegura a validação de formatos de email padrão.
- Telefone: Verifica a lógica de validação e formatação para 10 e 11 dígitos.
- Data: Confirma a validação de datas válidas e a formatação para DD/MM/YYYY, incluindo a correção para fusos horários (UTC).

auth.test.js

Middleware

Camada de Segurança e Autenticação:

- Token Válido: Garante que uma requisição com token JWT válido pode prosseguir.
- Token Ausente: Bloqueia requisições sem o header de autorização.
- Token Inválido: Rejeita requisições com tokens malformados, falsos ou expirados.

protocolo.routes.test.js

Integração

API de Consulta de Protocolos (GET /api/protocolos):

- Validação de Entrada: Rejeita a consulta se o parâmetro obrigatório start_date não for fornecido.
- Regra de Negócio: Impede consultas com intervalo de datas superior a 31 dias.
- Consulta com Sucesso: Confirma que a rota retorna status 200 e um array de dados quando os parâmetros são válidos.

reenvio.routes.test.js

Integração

API de Solicitação de Reenvio (POST /api/reenviar):

- Criação com Sucesso: Verifica se a rota processa uma solicitação válida e retorna o status 201 Created, confirmando que o recurso foi criado no sistema.

Resumo do Status
✅ Todos os testes estão a passar com sucesso. A cobertura atual abrange funções utilitárias críticas, a camada de autenticação e os fluxos principais das APIs de Protocolos e Reenvio, garantindo a confiabilidade destas funcionalidades.
