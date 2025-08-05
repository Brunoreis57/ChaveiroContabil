# Configuração do Supabase

Este projeto agora utiliza o Supabase como banco de dados. Siga os passos abaixo para configurar:

## 1. Criar conta no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta gratuita
3. Crie um novo projeto

## 2. Configurar o banco de dados

1. No painel do Supabase, vá para "SQL Editor"
2. Execute o script `database_schema.sql` que está na raiz do projeto
3. Isso criará todas as tabelas necessárias

## 3. Configurar as credenciais

1. No painel do Supabase, vá para "Settings" > "API"
2. Copie a "URL" e a "anon public" key
3. Abra o arquivo `supabase.js`
4. Substitua os valores:
   ```javascript
   const SUPABASE_URL = 'sua-url-aqui';
   const SUPABASE_ANON_KEY = 'sua-chave-aqui';
   ```

## 4. Testar a aplicação

1. Abra o arquivo `index.html` no navegador
2. Registre um novo usuário
3. Teste as funcionalidades de adicionar/remover serviços, despesas, etc.

## Estrutura do banco de dados

O banco possui as seguintes tabelas:
- `users`: Usuários do sistema
- `services`: Serviços prestados
- `expenses`: Despesas
- `inventory`: Itens do estoque
- `sales_list`: Vendas realizadas

Todas as tabelas possuem RLS (Row Level Security) habilitado para garantir que cada usuário acesse apenas seus próprios dados.

## Migração dos dados

Se você já tinha dados no localStorage, eles não serão migrados automaticamente. Você precisará:
1. Exportar os dados do localStorage (se necessário)
2. Recriar os dados no novo sistema

Ou implementar uma função de migração personalizada.