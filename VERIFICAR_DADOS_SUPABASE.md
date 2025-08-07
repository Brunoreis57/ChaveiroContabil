# Como Verificar se os Dados Estão Sendo Salvos no Supabase

## 🔍 Métodos de Verificação

### 1. Console do Navegador (Método Principal)

**Como acessar:**
1. Abra o site no navegador
2. Pressione `F12` ou clique com botão direito → "Inspecionar"
3. Vá para a aba "Console"

**O que procurar:**
- ✅ `Serviço salvo com sucesso no Supabase:` - Dados salvos
- ✅ `Despesa salva com sucesso no Supabase:` - Dados salvos
- ✅ `Status do Supabase: Conectado e funcionando` - Conexão OK
- ❌ `Erro ao salvar no Supabase:` - Problema na gravação
- ⚠️ `Status do Supabase: Problema de conexão` - Sem conexão

### 2. Dashboard do Supabase

**Como verificar:**
1. Acesse: https://supabase.com/dashboard
2. Faça login na sua conta
3. Selecione seu projeto: `vzdobzmacjzfclctzyha`
4. Vá em "Table Editor" no menu lateral
5. Verifique as tabelas:
   - `services` - Para serviços cadastrados
   - `expenses` - Para despesas cadastradas
   - `profiles` - Para usuários cadastrados

### 3. Teste de Conectividade Manual

**No console do navegador, digite:**
```javascript
// Testar conexão
DatabaseService.testConnection().then(result => {
    console.log('Resultado do teste:', result);
});

// Verificar usuário atual
console.log('Usuário atual:', currentUser);

// Listar serviços salvos
DatabaseService.getServices().then(services => {
    console.log('Serviços no Supabase:', services);
}).catch(error => {
    console.error('Erro ao buscar serviços:', error);
});
```

## 🚨 Problemas Comuns

### Erro: "Usuário não autenticado"
**Solução:** O sistema está usando o usuário pré-cadastrado (Bruno) que não precisa do Supabase. Os dados ficam apenas no localStorage.

### Erro: "Failed to fetch"
**Possíveis causas:**
- Sem conexão com internet
- Credenciais do Supabase incorretas
- Projeto Supabase inativo

### Dados não aparecem no Supabase
**Verificar:**
1. Se está logado com usuário real (não o pré-cadastrado)
2. Se as tabelas existem no Supabase
3. Se as políticas RLS estão configuradas

## 📊 Logs Detalhados

O sistema agora inclui logs detalhados para cada operação:

- 🔄 **Tentando salvar** - Início da operação
- ✅ **Salvo com sucesso** - Operação concluída
- ❌ **Erro ao salvar** - Falha na operação
- 🔗 **Status do Supabase** - Estado da conexão

## 💡 Dicas

1. **Sempre verifique o console** antes de reportar problemas
2. **Use o usuário pré-cadastrado** para testes locais
3. **Crie um usuário real** para testar o Supabase
4. **Mantenha o console aberto** durante os testes

## 🔧 Comandos Úteis para Debug

```javascript
// Ver todos os dados locais
console.log('Services:', services);
console.log('Expenses:', expenses);
console.log('Current User:', currentUser);

// Limpar dados locais
localStorage.clear();
location.reload();

// Forçar logout
logout();
```