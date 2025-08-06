# Sistema de Gestão para Chaveiro

## 🔥 Configuração do Firebase

### Passo 1: Criar Projeto no Firebase
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Digite o nome do projeto (ex: `chaveiro-sistema`)
4. Desabilite Google Analytics (opcional)
5. Clique em "Criar projeto"

### Passo 2: Configurar Authentication
1. No painel do Firebase, vá em **Authentication**
2. Clique em "Começar"
3. Na aba **Sign-in method**, habilite:
   - **Email/Password** (ative)
4. Salve as configurações

### Passo 3: Configurar Firestore Database
1. No painel do Firebase, vá em **Firestore Database**
2. Clique em "Criar banco de dados"
3. Escolha **Modo de teste** (por enquanto)
4. Selecione a localização (ex: `southamerica-east1`)
5. Clique em "Concluído"

### Passo 4: Obter Configurações do Projeto
1. No painel do Firebase, vá em **Configurações do projeto** (ícone de engrenagem)
2. Na seção "Seus aplicativos", clique em **Web** (`</>`)
3. Digite um nome para o app (ex: `chaveiro-web`)
4. **NÃO** marque "Configurar Firebase Hosting"
5. Clique em "Registrar app"
6. **COPIE** as configurações que aparecem:

```javascript
const firebaseConfig = {
  apiKey: "sua-api-key-aqui",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### Passo 5: Atualizar Arquivo firebase.js
1. Abra o arquivo `firebase.js`
2. Substitua as configurações fictícias pelas suas configurações reais:

```javascript
// ANTES (exemplo fictício)
const firebaseConfig = {
    apiKey: "SUA_API_KEY_AQUI",
    authDomain: "SEU_PROJECT_ID.firebaseapp.com",
    // ...
};

// DEPOIS (suas configurações reais)
const firebaseConfig = {
    apiKey: "AIzaSyBqJ8K9X7Y5Z3A2B1C4D6E8F0G2H4I6J8K", // Sua API Key real
    authDomain: "chaveiro-sistema-12345.firebaseapp.com", // Seu domínio real
    projectId: "chaveiro-sistema-12345", // Seu Project ID real
    storageBucket: "chaveiro-sistema-12345.appspot.com", // Seu Storage real
    messagingSenderId: "123456789012", // Seu Sender ID real
    appId: "1:123456789012:web:abcdef123456789012345678" // Seu App ID real
};
```

### Passo 6: Configurar Regras de Segurança do Firestore
1. No Firestore Database, vá na aba **Regras**
2. Substitua as regras por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler/escrever apenas seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Serviços, despesas, estoque e vendas do usuário autenticado
    match /{collection}/{document} {
      allow read, write: if request.auth != null && 
        resource.data.user_id == request.auth.uid;
    }
  }
}
```

## 🚀 Deploy no Vercel

### Passo 1: Preparar o Repositório
1. Certifique-se de que todas as alterações estão commitadas no Git
2. Faça push para o GitHub:

```bash
git add .
git commit -m "Add Firebase configuration"
git push origin main
```

### Passo 2: Deploy no Vercel
1. Acesse [Vercel](https://vercel.com/)
2. Faça login com sua conta GitHub
3. Clique em "New Project"
4. Selecione seu repositório `ChaveiroContabil`
5. Configure o projeto:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (padrão)
   - **Build Command**: deixe vazio
   - **Output Directory**: deixe vazio
6. Clique em "Deploy"

### Passo 3: Configurar Domínio do Firebase (Importante!)
1. Após o deploy, copie a URL do Vercel (ex: `https://seu-projeto.vercel.app`)
2. Volte ao Firebase Console
3. Vá em **Authentication** > **Settings** > **Authorized domains**
4. Clique em "Add domain"
5. Adicione seu domínio do Vercel: `seu-projeto.vercel.app`
6. Salve

## 📋 Estrutura do Projeto

```
chaveiroSite/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Lógica principal
├── firebase.js         # Configuração Firebase
├── user_config.js      # Configurações do usuário
├── vercel.json         # Configuração Vercel
└── README.md           # Este arquivo
```

## 🔧 Funcionalidades

- ✅ **Autenticação** com Firebase Auth
- ✅ **Gestão de serviços** realizados
- ✅ **Controle de despesas** por categoria
- ✅ **Gerenciamento de estoque** de materiais
- ✅ **Lista de preços** de serviços
- ✅ **Dashboard** com gráficos e estatísticas
- ✅ **Relatórios financeiros** detalhados
- ✅ **Interface responsiva** e moderna

## 🔒 Segurança

- Autenticação obrigatória para todas as operações
- Dados isolados por usuário
- Regras de segurança configuradas no Firestore
- Validação no frontend e backend

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- 💻 Desktop
- 📱 Tablets
- 📱 Smartphones

## 🆘 Suporte

Se encontrar problemas:
1. Verifique se as configurações do Firebase estão corretas
2. Confirme se o domínio está autorizado no Firebase Auth
3. Verifique o console do navegador para erros
4. Teste localmente antes do deploy

---

**Desenvolvido para gestão eficiente de negócios de chaveiro** 🔐