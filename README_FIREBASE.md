# Configuração do Firebase para Sistema de Gestão de Chaveiro

## Passos para configurar o Firebase:

### 1. Criar projeto no Firebase
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Digite o nome do projeto (ex: "chaveiro-sistema")
4. Siga os passos de configuração

### 2. Configurar Authentication
1. No painel do Firebase, vá em "Authentication"
2. Clique na aba "Sign-in method"
3. Ative "Email/Password"
4. Salve as configurações

### 3. Configurar Firestore Database
1. No painel do Firebase, vá em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" (para desenvolvimento)
4. Selecione uma localização próxima

### 4. Obter configurações do projeto
1. No painel do Firebase, vá em "Configurações do projeto" (ícone de engrenagem)
2. Role para baixo até "Seus aplicativos"
3. Clique em "</> Web"
4. Registre o aplicativo com um nome
5. Copie as configurações do Firebase

### 5. Atualizar o arquivo firebase.js
Substitua as configurações no arquivo `firebase.js` pelas suas configurações reais:

```javascript
const firebaseConfig = {
    apiKey: "sua-api-key-aqui",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto-id",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456789012345678"
};
```

### 6. Configurar regras de segurança do Firestore
No Firestore Database > Regras, use estas regras básicas para desenvolvimento:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura/escrita apenas para usuários autenticados
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 7. Estrutura das coleções
O sistema criará automaticamente as seguintes coleções:
- `users` - Dados dos usuários
- `services` - Serviços realizados
- `expenses` - Despesas
- `inventory` - Estoque
- `sales_list` - Lista de preços

## Vantagens do Firebase:
- ✅ Autenticação integrada e segura
- ✅ Banco de dados em tempo real
- ✅ Escalabilidade automática
- ✅ Backup automático
- ✅ Interface de administração
- ✅ Gratuito até 50.000 leituras/dia
- ✅ Mais estável que Supabase

## Testando o sistema:
1. Configure as credenciais do Firebase
2. Abra o `index.html` em um servidor local
3. Registre um novo usuário
4. Teste as funcionalidades do sistema

## Observações:
- As configurações atuais no código são apenas exemplos
- Substitua pelas suas configurações reais do Firebase
- Para produção, configure regras de segurança mais restritivas
- Considere ativar o modo de cobrança para uso em produção