# DynamoDB Streams - Projeto de Estudo

Este é um projeto de estudo sobre **DynamoDB Streams**, explorando a integração entre diferentes serviços da AWS e ferramentas de busca.

## 🎯 Objetivo

Este projeto foi desenvolvido para aprender e experimentar com as seguintes tecnologias:

- **AWS Lambda**: Funções serverless para processar eventos e requisições HTTP
- **Serverless Framework**: Framework para gerenciar e deployar aplicações serverless
- **DynamoDB Streams**: Captura de mudanças em tempo real no DynamoDB
- **Algolia**: Search engine para indexação e busca de produtos

## 🏗️ Arquitetura

O projeto implementa um sistema completo de gerenciamento de produtos com sincronização em tempo real e busca avançada:

```
                    ┌─────────────────┐
                    │   API REST      │
                    │  (HTTP APIs)    │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
         [Create]       [Update]       [Delete]
         [GetAll]       [GetById]
              │              │              │
              └──────────────┼──────────────┘
                             ▼
                    ┌─────────────────┐
                    │   DynamoDB      │
                    │     Table       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ DynamoDB Stream │
                    │  (CDC Events)   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Lambda Stream   │
                    │   Processor     │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
         [INSERT]       [MODIFY]       [REMOVE]
              │              │              │
              └──────────────┼──────────────┘
                             ▼
                    ┌─────────────────┐
                    │  Algolia Index  │
                    │  (Search Eng.)  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Search API     │
                    │  GET /search    │
                    └─────────────────┘
```

## 📦 Funcionalidades

### APIs REST

#### Gerenciamento de Produtos (DynamoDB)
- `POST /products` - Criar um novo produto
- `PUT /products/{productId}` - Atualizar um produto existente
- `DELETE /products/{productId}` - Deletar um produto
- `GET /products` - Listar todos os produtos
- `GET /products/{id}` - Buscar um produto específico por ID

#### Busca (Algolia)
- `GET /search/products?query=termo&page=1&perPage=10` - Buscar produtos no Algolia usando termo de pesquisa com paginação
  - **Parâmetros de query**:
    - `query` (obrigatório): Termo de pesquisa
    - `page` (opcional): Número da página (padrão: 1, mínimo: 1)
    - `perPage` (opcional): Itens por página (padrão: 10, mínimo: 1, máximo: 20)
  - **Resposta**: Retorna `data` (array de produtos), `totalItems` (total de itens encontrados) e `totalPages` (total de páginas)

#### Monitoramento
- `GET /shards` - Obter informações sobre os shards do stream

### Processamento de Streams
- **processDDBStream**: Lambda function que processa eventos do DynamoDB Streams e sincroniza automaticamente com o Algolia
  - Detecta inserções e modificações (INSERT/MODIFY) e atualiza o índice do Algolia
  - Detecta remoções (REMOVE) e remove o produto do índice do Algolia
  - Mantém o índice de busca sempre sincronizado com o banco de dados

## 🛠️ Tecnologias Utilizadas

- **Runtime**: Node.js 20.x
- **Linguagem**: TypeScript
- **Cloud Provider**: AWS
- **Framework**: Serverless Framework
- **Banco de Dados**: Amazon DynamoDB
- **Event Stream**: DynamoDB Streams
- **Search Engine**: Algolia
- **Bundler**: esbuild

### Dependências Principais
- `@aws-sdk/client-dynamodb` - SDK para interagir com DynamoDB
- `@aws-sdk/client-dynamodb-streams` - SDK para DynamoDB Streams
- `algoliasearch` - Cliente oficial do Algolia para integração
- `zod` - Validação de schemas

### Serviços e Integrações
- **AlgoliaService**: Classe de serviço que encapsula operações do Algolia
  - `search({ query, page, perPage })`: Busca produtos no índice com suporte a paginação
    - Retorna: `{ hits, totalItems, totalPages }`
  - `upsert(object)`: Insere ou atualiza um documento
  - `delete(objectID)`: Remove um documento do índice

## 🚀 Como Executar

### Pré-requisitos
- Node.js 20.x ou superior
- pnpm (gerenciador de pacotes)
- AWS CLI configurado
- Conta na AWS
- Conta no Algolia (para search engine)

### Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```bash
ALGOLIA_APP_ID=seu_app_id_do_algolia
ALGOLIA_API_KEY=sua_api_key_do_algolia
```

### Instalação

```bash
# Instalar dependências
pnpm install

# Deploy na AWS
npx serverless deploy
```

## 📝 Configuração

O projeto utiliza o Serverless Framework para gerenciar a infraestrutura como código. As principais configurações estão em `serverless.yml`:

- **Região**: us-east-1
- **Arquitetura**: ARM64
- **Billing**: Pay per request
- **Stream View Type**: NEW_AND_OLD_IMAGES
- **DLQ**: Dead Letter Queue (SQS) para eventos que falharem no processamento

## 🔄 Como Funciona o DynamoDB Stream

1. Uma operação CRUD é realizada na tabela Products (INSERT, MODIFY ou REMOVE)
2. O DynamoDB Stream captura essa mudança em tempo real
3. A Lambda function `processDDBStream` é invocada automaticamente com o evento
4. A função processa o evento e sincroniza com o Algolia:
   - **INSERT/MODIFY**: Adiciona ou atualiza o produto no índice do Algolia via `upsert()`
   - **REMOVE**: Remove o produto do índice do Algolia via `delete()`
5. O índice de busca fica sempre sincronizado com o banco de dados

### Fluxo de Busca

Quando um usuário realiza uma busca:
1. Requisição é feita para `GET /search/products?query=termo&page=1&perPage=10`
2. A função `search` valida os parâmetros (query, page, perPage) usando Zod
3. A consulta é feita diretamente no índice do Algolia (não no DynamoDB)
4. Resultados são retornados com paginação: `data` (produtos), `totalItems` e `totalPages`
5. Benefícios: busca full-text, typo tolerance, relevância, performance otimizada e navegação por páginas

## 📚 Aprendizados

Este projeto explora conceitos importantes de arquiteturas modernas:

- **Event-driven architecture**: Uso de eventos para propagar mudanças entre sistemas
- **Serverless computing**: Funções Lambda escaláveis e sem gerenciamento de servidores
- **Stream processing**: Processamento de eventos em tempo real com DynamoDB Streams
- **Data synchronization**: Sincronização automática entre DynamoDB e Algolia
- **Search optimization**: Separação entre banco de dados transacional e sistema de busca
- **Infrastructure as Code (IaC)**: Gerenciamento de infraestrutura via Serverless Framework
- **Dead Letter Queues**: Tratamento robusto de falhas no processamento de streams
- **Retry strategies**: Configuração de tentativas e tolerância a falhas
- **CDC (Change Data Capture)**: Captura de mudanças de dados para sincronização

## 📄 Licença

ISC

---

**Nota**: Este é um projeto de estudo e experimentação. Não recomendado para uso em produção sem as devidas adaptações e melhorias de segurança.
