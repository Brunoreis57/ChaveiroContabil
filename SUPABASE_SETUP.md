# Configuração do Supabase para Chaveiro Contábil

## 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta ou faça login
3. Clique em "New Project"
4. Escolha sua organização
5. Digite o nome do projeto: "chaveiro-contabil"
6. Crie uma senha forte para o banco de dados
7. Escolha a região mais próxima
8. Clique em "Create new project"

## 2. Obter Credenciais

Após criar o projeto:
1. Vá em Settings > API
2. Copie a **URL** e a **anon public key**
3. Substitua no arquivo `supabase.js`:
   - `SUA_SUPABASE_URL_AQUI` pela URL do projeto
   - `SUA_SUPABASE_ANON_KEY_AQUI` pela chave anon public

## 3. Criar Tabelas no Banco de Dados

Vá em SQL Editor no painel do Supabase e execute os seguintes comandos:

### 3.1 Tabela de Perfis de Usuário
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas seus próprios dados
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### 3.2 Tabela de Serviços
```sql
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT,
  service_type TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pendente',
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own services" ON services
  FOR ALL USING (auth.uid() = user_id);
```

### 3.3 Tabela de Despesas
```sql
CREATE TABLE expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own expenses" ON expenses
  FOR ALL USING (auth.uid() = user_id);
```

### 3.4 Tabela de Estoque
```sql
CREATE TABLE stock (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  unit_price DECIMAL(10,2),
  supplier TEXT,
  minimum_stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE stock ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own stock" ON stock
  FOR ALL USING (auth.uid() = user_id);
```

### 3.5 Tabela de Lista de Preços
```sql
CREATE TABLE price_list (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  service_name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE price_list ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own price list" ON price_list
  FOR ALL USING (auth.uid() = user_id);
```

## 4. Configurar Autenticação

1. Vá em Authentication > Settings
2. Em "Site URL", adicione: `http://localhost:8000`
3. Em "Redirect URLs", adicione: `http://localhost:8000`
4. Habilite "Email confirmations" se desejar
5. Configure "Email templates" se necessário

## 5. Testar a Configuração

1. Substitua as credenciais no arquivo `supabase.js`
2. Execute o servidor local
3. Teste criando uma conta
4. Teste fazendo login
5. Teste as funcionalidades do sistema

## 6. Deploy em Produção

Quando fizer deploy:
1. Adicione a URL de produção nas configurações de autenticação
2. Atualize as Redirect URLs
3. Configure variáveis de ambiente se necessário

## Estrutura das Tabelas

- **profiles**: Dados dos usuários (nome, email, telefone)
- **services**: Serviços prestados (cliente, tipo, preço, status)
- **expenses**: Despesas do negócio (descrição, valor, categoria)
- **stock**: Controle de estoque (nome, quantidade, preço)
- **price_list**: Lista de preços dos serviços

Todas as tabelas têm RLS (Row Level Security) habilitado para garantir que cada usuário veja apenas seus próprios dados.