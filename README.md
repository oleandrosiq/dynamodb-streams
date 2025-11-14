# DynamoDB Streams - Projeto de Estudo

Este é um projeto de estudo sobre **DynamoDB Streams**, explorando a integração entre diferentes serviços da AWS e ferramentas de busca.

## 🎯 Objetivo

Este projeto foi desenvolvido para aprender e experimentar com as seguintes tecnologias:

- **AWS Lambda**: Funções serverless para processar eventos e requisições HTTP
- **Serverless Framework**: Framework para gerenciar e deployar aplicações serverless
- **DynamoDB Streams**: Captura de mudanças em tempo real no DynamoDB
- **Algolia**: Search engine para indexação e busca de produtos

## 🏗️ Arquitetura

O projeto implementa um sistema de gerenciamento de produtos com sincronização automática para um índice de busca:

```
┌─────────────┐
│   API HTTP  │
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌──────────────────┐
│  DynamoDB   │─────▶│ DynamoDB Streams │
│   Table     │      └────────┬─────────┘
└─────────────┘               │
                              ▼
                     ┌────────────────┐
                     │  Lambda Stream │
                     │   Processor    │
                     └────────┬───────┘
                              │
                              ▼
                        ┌──────────┐
                        │ Algolia  │
                        │  Index   │
                        └──────────┘
```

## 📦 Funcionalidades

### APIs REST
- `POST /products` - Criar um novo produto
- `PUT /products/{productId}` - Atualizar um produto existente
- `DELETE /products/{productId}` - Deletar um produto
- `GET /products` - Listar todos os produtos
- `GET /shards` - Obter informações sobre os shards do stream

### Processamento de Streams
- **processDDBStream**: Lambda function que processa eventos do DynamoDB Streams e sincroniza com o Algolia
  - Detecta inserções e modificações (INSERT/MODIFY)
  - Detecta remoções (REMOVE)
  - Atualiza o índice do Algolia automaticamente

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
- `algoliasearch` - Cliente para integração com Algolia
- `zod` - Validação de schemas

## 🚀 Como Executar

### Pré-requisitos
- Node.js 20.x ou superior
- pnpm (gerenciador de pacotes)
- AWS CLI configurado
- Conta na AWS
- Conta no Algolia (para search engine)

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

1. Uma operação é realizada na tabela Products (INSERT, MODIFY ou REMOVE)
2. O DynamoDB Stream captura essa mudança
3. A Lambda function `processDDBStream` é invocada automaticamente
4. A função processa o evento e sincroniza com o Algolia:
   - **INSERT/MODIFY**: Adiciona ou atualiza o produto no índice
   - **REMOVE**: Remove o produto do índice

## 📚 Aprendizados

Este projeto explora conceitos importantes:

- Event-driven architecture
- Serverless computing
- Stream processing
- Data synchronization
- Infrastructure as Code (IaC)
- Dead Letter Queues para tratamento de falhas
- Retry strategies

## 📄 Licença

ISC

---

**Nota**: Este é um projeto de estudo e experimentação. Não recomendado para uso em produção sem as devidas adaptações e melhorias de segurança.
