# Contribuindo para o Projeto

Obrigado por querer contribuir! Este documento descreve as regras e fluxos de trabalho que devemos seguir para manter o repositório organizado e facilitar a colaboração.
Siga as instruções abaixo ao contribuir com novas funcionalidades ou corrigir bugs.

## Revisão de Pull Requests
- Após criar uma Pull Request, marque um revisor.
- Certifique-se de que a Pull Request esteja alinhada com as guidelines do projeto antes de solicitar a revisão.
- Resolva todos os comentários antes de realizar o merge.

## Testes
- Antes de abrir uma Pull Request, certifique-se de que todos os testes passam.
- Adicione novos testes para funcionalidades ou correções de bugs.

## Boas Práticas de Código
- Mantenha o código limpo e legível, com comentários explicativos quando necessário.
- Siga as convenções de nomenclatura para classes, IDs e variáveis.
- Evite duplicação de código.
- Comentar seus codigos é essencial.

## Fluxo de Trabalho com Git

Para garantir um fluxo de trabalho consistente e eficaz, todos os colaboradores devem seguir as regras de nomenclatura de branches e de criação de Pull Requests descritas a seguir.

### Estrutura de Branches

- **main**: Branch principal com o código estável de produção.
- **feature/<nome>**: Branch para novas funcionalidades.
- **bugfix/<nome>**: Branch para correções de bugs.

## Como Criar uma Nova Branch

### 1. Branch de Funcionalidade (feature)

Sempre que for iniciar uma nova funcionalidade, crie uma nova branch a partir da `main`. A nomenclatura da branch será:

```bash
feature/<nome-da-funcionalidade>
```
### 2. Branch para Correcao de Bugs (bugfix)

Sempre que for iniciar uma nova correcao de Bug, crie uma nova branch a partir da `main`. A nomenclatura da branch será:

```bash
bugfix/<nome-da-correcao>
```

# Padrão de Mensagens de Commit
As mensagens de commit devem ser curtas, claras e descritivas. Abaixo está a estrutura para as mensagens de commit:

## Tipos de Commit
feat: Para uma nova funcionalidade (feature).

Exemplo: feat(login): adicionar funcionalidade de login com OAuth

fix: Para correções de bugs.

Exemplo: fix(auth): corrigir erro ao validar token de sessão

docs: Para mudanças na documentação, como o README, Wikis, etc.

Exemplo: docs(readme): adicionar seção de instalação

style: Para mudanças que não afetam a funcionalidade, como formatação, espaçamento, etc. (sem mudanças no código).

Exemplo: style(header): ajustar indentação no cabeçalho

refactor: Para alterações no código que não adicionam funcionalidades nem corrigem bugs, mas melhoram a estrutura ou a legibilidade do código.

Exemplo: refactor(auth): refatorar a função de login para otimizar desempenho

test: Para adicionar ou corrigir testes.

Exemplo: test(auth): adicionar testes para validação de login.

perf: Para alterações que melhoram o desempenho da aplicação.

Exemplo: perf(api): melhorar tempo de resposta na busca de usuários

## Estrutura de Mensagens
Título (obrigatório): Deve ser uma frase curta (menos de 72 caracteres) e descrever o que foi feito. Use um verbo no imperativo.

### Exemplos:

feat(auth): adicionar funcionalidade de autenticação via Google

fix(button): corrigir cor do botão de envio

Corpo (opcional): Pode explicar o que foi feito, por que foi feito e como. Use parágrafos curtos.
No corpo, evite frases como "consertado", "arrumado" ou "feito", pois a própria mensagem de commit já comunica a ação realizada.