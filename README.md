# GigaBrain Frontend

Frontend do GigaBrain, construído com React, TypeScript, Vite e TanStack Router.

## Requisitos

- Node.js compatível com a versão de Vite usada pelo projeto.
- API do GigaBrain em execução local ou acessível pela URL configurada.

## Configuração da API

Copie `.env.example` para `.env.local` e ajuste os valores conforme seu ambiente:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
VITE_API_TOKEN=
```

`VITE_API_BASE_URL` define a URL base do backend. Se omitida, o frontend usa `http://127.0.0.1:8000/api/v1`.

`VITE_API_TOKEN` é opcional e serve apenas para desenvolvimento local quando a API foi iniciada com `--token`. Variáveis `VITE_*` são incorporadas ao bundle do navegador; **não coloque segredos de produção nessa variável**. Em produção, a autenticação deve ser projetada para o ambiente de implantação, sem expor credenciais privilegiadas no cliente.

A API disponibiliza documentação interativa em `http://127.0.0.1:8000/docs` quando executada localmente.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Verificações

```bash
npm run build
npm run lint
```

## Estrutura de integração

- `src/services/api.ts`: cliente Axios compartilhado, configuração de ambiente, timeout e normalização de mensagens de erro.
- `src/services/api.types.ts`: contratos TypeScript da API.
- `src/services/chat.service.ts`: abertura, envio de mensagens, aprovação e encerramento de conversas.
- `src/services/history.service.ts`: consultas de conversas, eventos, requisitos, links e especialistas.

Os serviços retornam diretamente o corpo da resposta (`data`), para que os componentes não dependam dos detalhes internos do Axios.

## Etapa 02 — Conversação com o Digital Twin

A rota `/project/new` agora apresenta o histórico de mensagens e a resposta da API, em vez de descartar o retorno de `POST /conversations/{id}/messages`.

- Mensagens do Product Owner e do Digital Twin são exibidas em sequência.
- Enquanto a API processa uma mensagem, a interface informa que a resposta pode levar até um minuto.
- Propostas retornadas pela API exibem história de usuário, critérios de aceitação e verificações de qualidade disponíveis.
- A ação `propose` permite solicitar ajustes ou aprovar a proposta. A aprovação só é confirmada na interface após uma resposta bem-sucedida da API.
- A ação `approved` apresenta os identificadores salvos retornados pelo backend.
- Eventos `behind_the_scenes` podem ser consultados em uma seção expansível.
- O usuário pode encerrar uma conversa sem aprovar uma proposta pendente ou iniciar outra conversa após o encerramento.
- Falhas de envio preservam o texto no campo de composição para permitir nova tentativa.

A validação de sintaxe TSX foi executada. O build, ESLint e testes contra o backend ainda precisam ser executados no ambiente com as dependências instaladas e a API local em execução.

## Rotas integradas

- `/project/new`: inicia uma conversa com o Digital Twin.
- `/project/$id`: consulta o histórico de uma conversa existente.
- `/requirements`: lista requisitos persistidos, com pesquisa e filtros locais por status e tópico.
- `/requirements/$id`: exibe detalhes, critérios de aceitação, verificações de qualidade, versões e relacionamentos retornados pela API.

A área de requisitos utiliza os endpoints de leitura da API. Os dados exibidos dependem dos recursos implementados no backend simulado; quando a API não fornece versões, critérios ou relacionamentos, a interface informa que esses dados não estão disponíveis, sem inventá-los.

### Especialistas

- `/experts`: catálogo de especialistas com pesquisa por tópico, descrição e arquivo de conhecimento.
- `/experts/$id`: detalhes, conteúdo da base de conhecimento, métricas de consulta e histórico de versões.

As telas usam os endpoints `GET /experts` e `GET /experts/{id}` da API configurada em `VITE_API_BASE_URL`.
