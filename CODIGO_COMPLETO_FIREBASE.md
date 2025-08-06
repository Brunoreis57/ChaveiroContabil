# Sistema de Gestão para Chaveiro - Versão Firebase

## Arquivo: index.html
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Gestão - Chaveiro</title>
    <link rel="stylesheet" href="styles.css">
    
    <!-- Chart.js para gráficos -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <!-- Firebase CDN -->
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
    <script src="firebase.js"></script>
</head>
<body>
    <!-- Tela de Login -->
    <div id="loginScreen" class="login-screen">
        <div class="login-container">
            <div class="login-header">
                <h1>🔐 Sistema Chaveiro</h1>
                <p>Gerencie seu negócio com eficiência</p>
            </div>
            
            <div class="login-tabs">
                <button class="tab-btn active" onclick="showLogin()">Entrar</button>
                <button class="tab-btn" onclick="showRegister()">Cadastrar</button>
            </div>
            
            <!-- Formulário de Login -->
            <form id="loginForm" class="auth-form">
                <div class="input-group">
                    <label for="loginEmail">Email:</label>
                    <input type="email" id="loginEmail" required>
                </div>
                
                <div class="input-group">
                    <label for="loginPassword">Senha:</label>
                    <div class="password-input">
                        <input type="password" id="loginPassword" required>
                        <button type="button" class="toggle-password" onclick="togglePassword('loginPassword')">
                            👁️
                        </button>
                    </div>
                </div>
                
                <button type="submit" class="auth-btn">Entrar</button>
            </form>
            
            <!-- Formulário de Cadastro -->
            <form id="registerForm" class="auth-form" style="display: none;">
                <div class="input-group">
                    <label for="registerName">Nome:</label>
                    <input type="text" id="registerName" required>
                </div>
                
                <div class="input-group">
                    <label for="registerEmail">Email:</label>
                    <input type="email" id="registerEmail" required>
                </div>
                
                <div class="input-group">
                    <label for="registerPhone">Telefone:</label>
                    <input type="tel" id="registerPhone" required>
                </div>
                
                <div class="input-group">
                    <label for="registerPassword">Senha:</label>
                    <div class="password-input">
                        <input type="password" id="registerPassword" required>
                        <button type="button" class="toggle-password" onclick="togglePassword('registerPassword')">
                            👁️
                        </button>
                    </div>
                </div>
                
                <button type="submit" class="auth-btn">Cadastrar</button>
            </form>
        </div>
    </div>

    <!-- Aplicativo Principal -->
    <div id="mainApp" class="app" style="display: none;">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <h2>🔐 Chaveiro</h2>
            </div>
            
            <nav class="sidebar-nav">
                <a href="#" class="nav-item active" data-section="dashboard">
                    <span class="nav-icon">📊</span>
                    Dashboard
                </a>
                <a href="#" class="nav-item" data-section="services">
                    <span class="nav-icon">🔧</span>
                    Serviços
                </a>
                <a href="#" class="nav-item" data-section="expenses">
                    <span class="nav-icon">💰</span>
                    Despesas
                </a>
                <a href="#" class="nav-item" data-section="inventory">
                    <span class="nav-icon">📦</span>
                    Estoque
                </a>
                <a href="#" class="nav-item" data-section="sales">
                    <span class="nav-icon">💲</span>
                    Lista de Preços
                </a>
                <a href="#" class="nav-item" data-section="reports">
                    <span class="nav-icon">📈</span>
                    Relatórios
                </a>
            </nav>
            
            <div class="sidebar-footer">
                <button class="logout-btn" onclick="logout()">Sair</button>
            </div>
        </aside>

        <!-- Conteúdo Principal -->
        <main class="main-content">
            <!-- Header -->
            <header class="app-header">
                <button class="menu-toggle" onclick="toggleSidebar()">
                    ☰
                </button>
                <div class="user-info">
                    <span id="userName">Usuário</span>
                </div>
            </header>

            <!-- Dashboard -->
            <section id="dashboard" class="content-section active">
                <h2>Dashboard</h2>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>Receita do Mês</h3>
                        <p class="stat-value" id="monthlyRevenue">R$ 0,00</p>
                    </div>
                    <div class="stat-card">
                        <h3>Serviços Realizados</h3>
                        <p class="stat-value" id="servicesCount">0</p>
                    </div>
                    <div class="stat-card">
                        <h3>Despesas do Mês</h3>
                        <p class="stat-value" id="monthlyExpenses">R$ 0,00</p>
                    </div>
                    <div class="stat-card">
                        <h3>Lucro do Mês</h3>
                        <p class="stat-value" id="monthlyProfit">R$ 0,00</p>
                    </div>
                </div>
                
                <div class="charts-grid">
                    <div class="chart-container">
                        <h3>Receita dos Últimos 7 Dias</h3>
                        <canvas id="revenueChart"></canvas>
                    </div>
                    <div class="chart-container">
                        <h3>Serviços por Tipo</h3>
                        <canvas id="servicesChart"></canvas>
                    </div>
                </div>
            </section>

            <!-- Serviços -->
            <section id="services" class="content-section">
                <div class="section-header">
                    <h2>Serviços</h2>
                    <button class="add-btn" onclick="showServiceModal()">+ Adicionar Serviço</button>
                </div>
                
                <div class="filters">
                    <input type="date" id="serviceStartDate" onchange="filterServices()">
                    <input type="date" id="serviceEndDate" onchange="filterServices()">
                    <select id="serviceTypeFilter" onchange="filterServices()">
                        <option value="">Todos os tipos</option>
                        <option value="Cópia de chave">Cópia de chave</option>
                        <option value="Abertura de fechadura">Abertura de fechadura</option>
                        <option value="Instalação de fechadura">Instalação de fechadura</option>
                        <option value="Reparo de fechadura">Reparo de fechadura</option>
                        <option value="Chave codificada">Chave codificada</option>
                        <option value="Outros">Outros</option>
                    </select>
                </div>
                
                <div id="servicesList" class="items-list">
                    <!-- Serviços serão carregados aqui -->
                </div>
            </section>

            <!-- Despesas -->
            <section id="expenses" class="content-section">
                <div class="section-header">
                    <h2>Despesas</h2>
                    <button class="add-btn" onclick="showExpenseModal()">+ Adicionar Despesa</button>
                </div>
                
                <div class="filters">
                    <input type="date" id="expenseStartDate" onchange="filterExpenses()">
                    <input type="date" id="expenseEndDate" onchange="filterExpenses()">
                    <select id="expenseCategoryFilter" onchange="filterExpenses()">
                        <option value="">Todas as categorias</option>
                        <option value="Material">Material</option>
                        <option value="Transporte">Transporte</option>
                        <option value="Alimentação">Alimentação</option>
                        <option value="Equipamentos">Equipamentos</option>
                        <option value="Outros">Outros</option>
                    </select>
                </div>
                
                <div id="expensesList" class="items-list">
                    <!-- Despesas serão carregadas aqui -->
                </div>
            </section>

            <!-- Estoque -->
            <section id="inventory" class="content-section">
                <div class="section-header">
                    <h2>Estoque</h2>
                    <button class="add-btn" onclick="showInventoryModal()">+ Adicionar Item</button>
                </div>
                
                <div class="filters">
                    <select id="inventoryCategoryFilter" onchange="filterInventory()">
                        <option value="">Todas as categorias</option>
                        <option value="Chaves">Chaves</option>
                        <option value="Fechaduras">Fechaduras</option>
                        <option value="Ferramentas">Ferramentas</option>
                        <option value="Acessórios">Acessórios</option>
                        <option value="Outros">Outros</option>
                    </select>
                </div>
                
                <div id="inventoryList" class="items-list">
                    <!-- Itens do estoque serão carregados aqui -->
                </div>
            </section>

            <!-- Lista de Preços -->
            <section id="sales" class="content-section">
                <div class="section-header">
                    <h2>Lista de Preços</h2>
                    <button class="add-btn" onclick="showSalesModal()">+ Adicionar Serviço</button>
                </div>
                
                <div id="salesList" class="items-list">
                    <!-- Lista de preços será carregada aqui -->
                </div>
            </section>

            <!-- Relatórios -->
            <section id="reports" class="content-section">
                <h2>Relatórios</h2>
                
                <div class="reports-grid">
                    <div class="report-card">
                        <h3>Esta Semana</h3>
                        <div class="report-stats">
                            <p>Receita: <span id="weekRevenue">R$ 0,00</span></p>
                            <p>Despesas: <span id="weekExpenses">R$ 0,00</span></p>
                            <p>Lucro: <span id="weekProfit">R$ 0,00</span></p>
                        </div>
                    </div>
                    
                    <div class="report-card">
                        <h3>Este Mês</h3>
                        <div class="report-stats">
                            <p>Receita: <span id="monthRevenue">R$ 0,00</span></p>
                            <p>Despesas: <span id="monthExpenses">R$ 0,00</span></p>
                            <p>Lucro: <span id="monthProfit">R$ 0,00</span></p>
                        </div>
                    </div>
                    
                    <div class="report-card">
                        <h3>Últimos 30 Dias</h3>
                        <div class="report-stats">
                            <p>Receita: <span id="last30Revenue">R$ 0,00</span></p>
                            <p>Despesas: <span id="last30Expenses">R$ 0,00</span></p>
                            <p>Lucro: <span id="last30Profit">R$ 0,00</span></p>
                        </div>
                    </div>
                </div>
                
                <div class="report-details">
                    <div class="report-section">
                        <h3>Serviços Mais Realizados</h3>
                        <div id="topServices"></div>
                    </div>
                    
                    <div class="report-section">
                        <h3>Despesas por Categoria</h3>
                        <div id="expensesByCategory"></div>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <!-- Modal Adicionar Serviço -->
    <div id="serviceModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Adicionar Serviço</h3>
                <button class="close-btn" onclick="closeModal('serviceModal')">&times;</button>
            </div>
            
            <form id="serviceForm">
                <div class="form-group">
                    <label for="serviceDate">Data:</label>
                    <input type="date" id="serviceDate" required>
                </div>
                
                <div class="form-group">
                    <label for="serviceType">Tipo de Serviço:</label>
                    <input type="text" id="serviceType" list="serviceTypes" required>
                    <datalist id="serviceTypes">
                        <option value="Cópia de chave">
                        <option value="Abertura de fechadura">
                        <option value="Instalação de fechadura">
                        <option value="Reparo de fechadura">
                        <option value="Chave codificada">
                        <option value="Outros">
                    </datalist>
                </div>
                
                <div class="form-group">
                    <label for="lockModel">Modelo da Fechadura:</label>
                    <input type="text" id="lockModel" list="lockModels">
                    <datalist id="lockModels">
                        <option value="Tetra">
                        <option value="Yale">
                        <option value="Pado">
                        <option value="Stam">
                        <option value="Outros">
                    </datalist>
                </div>
                
                <div class="form-group">
                    <label for="serviceValue">Valor (R$):</label>
                    <input type="number" id="serviceValue" step="0.01" required>
                </div>
                
                <div class="form-group">
                    <label for="serviceNotes">Observações:</label>
                    <textarea id="serviceNotes" rows="3"></textarea>
                </div>
                
                <div class="modal-actions">
                    <button type="button" onclick="closeModal('serviceModal')">Cancelar</button>
                    <button type="submit">Salvar</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal Adicionar Despesa -->
    <div id="expenseModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Adicionar Despesa</h3>
                <button class="close-btn" onclick="closeModal('expenseModal')">&times;</button>
            </div>
            
            <form id="expenseForm">
                <div class="form-group">
                    <label for="expenseDate">Data:</label>
                    <input type="date" id="expenseDate" required>
                </div>
                
                <div class="form-group">
                    <label for="expenseCategory">Categoria:</label>
                    <select id="expenseCategory" required>
                        <option value="">Selecione...</option>
                        <option value="Material">Material</option>
                        <option value="Transporte">Transporte</option>
                        <option value="Alimentação">Alimentação</option>
                        <option value="Equipamentos">Equipamentos</option>
                        <option value="Outros">Outros</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="expenseDescription">Descrição:</label>
                    <input type="text" id="expenseDescription" required>
                </div>
                
                <div class="form-group">
                    <label for="expenseValue">Valor (R$):</label>
                    <input type="number" id="expenseValue" step="0.01" required>
                </div>
                
                <div class="modal-actions">
                    <button type="button" onclick="closeModal('expenseModal')">Cancelar</button>
                    <button type="submit">Salvar</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal Adicionar Item ao Estoque -->
    <div id="inventoryModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Adicionar Item ao Estoque</h3>
                <button class="close-btn" onclick="closeModal('inventoryModal')">&times;</button>
            </div>
            
            <form id="inventoryForm">
                <div class="form-group">
                    <label for="inventoryName">Nome do Item:</label>
                    <input type="text" id="inventoryName" required>
                </div>
                
                <div class="form-group">
                    <label for="inventoryCategory">Categoria:</label>
                    <select id="inventoryCategory" required>
                        <option value="">Selecione...</option>
                        <option value="Chaves">Chaves</option>
                        <option value="Fechaduras">Fechaduras</option>
                        <option value="Ferramentas">Ferramentas</option>
                        <option value="Acessórios">Acessórios</option>
                        <option value="Outros">Outros</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="inventoryQuantity">Quantidade:</label>
                    <input type="number" id="inventoryQuantity" min="0" required>
                </div>
                
                <div class="form-group">
                    <label for="inventoryUnitPrice">Preço Unitário (R$):</label>
                    <input type="number" id="inventoryUnitPrice" step="0.01" min="0" required>
                </div>
                
                <div class="form-group">
                    <label for="inventorySupplier">Fornecedor:</label>
                    <input type="text" id="inventorySupplier">
                </div>
                
                <div class="form-group">
                    <label for="inventoryNotes">Observações:</label>
                    <textarea id="inventoryNotes" rows="3"></textarea>
                </div>
                
                <div class="modal-actions">
                    <button type="button" onclick="closeModal('inventoryModal')">Cancelar</button>
                    <button type="submit">Salvar</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal Adicionar Serviço à Lista -->
    <div id="salesModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Adicionar Serviço à Lista</h3>
                <button class="close-btn" onclick="closeModal('salesModal')">&times;</button>
            </div>
            
            <form id="salesForm">
                <div class="form-group">
                    <label for="salesServiceName">Nome do Serviço:</label>
                    <input type="text" id="salesServiceName" required>
                </div>
                
                <div class="form-group">
                    <label for="salesPrice">Preço de Venda (R$):</label>
                    <input type="number" id="salesPrice" step="0.01" min="0" required>
                </div>
                
                <div class="form-group">
                    <label for="salesCost">Custo (R$):</label>
                    <input type="number" id="salesCost" step="0.01" min="0">
                </div>
                
                <div class="form-group">
                    <label for="salesProfitMargin">Margem de Lucro (%):</label>
                    <input type="number" id="salesProfitMargin" step="0.01" min="0">
                </div>
                
                <div class="form-group">
                    <label for="salesNotes">Observações:</label>
                    <textarea id="salesNotes" rows="3"></textarea>
                </div>
                
                <div class="modal-actions">
                    <button type="button" onclick="closeModal('salesModal')">Cancelar</button>
                    <button type="submit">Salvar</button>
                </div>
            </form>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
```

## Arquivo: firebase.js
```javascript
// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBqJ8K9X7Y5Z3A2B1C4D6E8F0G2H4I6J8K",
    authDomain: "chaveiro-sistema.firebaseapp.com",
    projectId: "chaveiro-sistema",
    storageBucket: "chaveiro-sistema.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456789012345678"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Funções de banco de dados
class DatabaseService {
    // Usuários
    static async createUser(userData) {
        try {
            // Criar usuário com autenticação do Firebase
            const userCredential = await auth.createUserWithEmailAndPassword(userData.email, userData.password);
            const user = userCredential.user;
            
            // Salvar dados adicionais no Firestore
            await db.collection('users').doc(user.uid).set({
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                created_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return {
                id: user.uid,
                name: userData.name,
                email: userData.email,
                phone: userData.phone
            };
        } catch (error) {
            throw error;
        }
    }

    static async loginUser(email, password) {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Buscar dados adicionais do usuário
            const userDoc = await db.collection('users').doc(user.uid).get();
            const userData = userDoc.data();
            
            return {
                id: user.uid,
                name: userData.name,
                email: userData.email,
                phone: userData.phone
            };
        } catch (error) {
            throw error;
        }
    }

    static async getCurrentUser() {
        return new Promise((resolve) => {
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    const userDoc = await db.collection('users').doc(user.uid).get();
                    const userData = userDoc.data();
                    resolve({
                        id: user.uid,
                        name: userData.name,
                        email: userData.email,
                        phone: userData.phone
                    });
                } else {
                    resolve(null);
                }
            });
        });
    }

    static async logout() {
        await auth.signOut();
    }

    // Serviços
    static async createService(serviceData) {
        try {
            const docRef = await db.collection('services').add({
                user_id: serviceData.userId,
                date: serviceData.date,
                type: serviceData.type,
                lock_model: serviceData.lockModel,
                value: parseFloat(serviceData.value),
                notes: serviceData.notes,
                created_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            const doc = await docRef.get();
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            throw error;
        }
    }

    static async getServices(userId) {
        try {
            const snapshot = await db.collection('services')
                .where('user_id', '==', userId)
                .orderBy('created_at', 'desc')
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            throw error;
        }
    }

    static async updateService(id, serviceData) {
        try {
            await db.collection('services').doc(id).update({
                date: serviceData.date,
                type: serviceData.type,
                lock_model: serviceData.lockModel,
                value: parseFloat(serviceData.value),
                notes: serviceData.notes,
                updated_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            const doc = await db.collection('services').doc(id).get();
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            throw error;
        }
    }

    static async deleteService(id) {
        try {
            await db.collection('services').doc(id).delete();
            return { success: true };
        } catch (error) {
            throw error;
        }
    }

    // Despesas
    static async createExpense(expenseData) {
        try {
            const docRef = await db.collection('expenses').add({
                user_id: expenseData.userId,
                date: expenseData.date,
                category: expenseData.category,
                description: expenseData.description,
                value: parseFloat(expenseData.value),
                created_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            const doc = await docRef.get();
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            throw error;
        }
    }

    static async getExpenses(userId) {
        try {
            const snapshot = await db.collection('expenses')
                .where('user_id', '==', userId)
                .orderBy('created_at', 'desc')
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            throw error;
        }
    }

    static async updateExpense(id, expenseData) {
        try {
            await db.collection('expenses').doc(id).update({
                date: expenseData.date,
                category: expenseData.category,
                description: expenseData.description,
                value: parseFloat(expenseData.value),
                updated_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            const doc = await db.collection('expenses').doc(id).get();
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            throw error;
        }
    }

    static async deleteExpense(id) {
        try {
            await db.collection('expenses').doc(id).delete();
            return { success: true };
        } catch (error) {
            throw error;
        }
    }

    // Estoque
    static async createInventoryItem(inventoryData) {
        try {
            const docRef = await db.collection('inventory').add({
                user_id: inventoryData.userId,
                name: inventoryData.name,
                category: inventoryData.category,
                quantity: parseInt(inventoryData.quantity),
                unit_price: parseFloat(inventoryData.unitPrice),
                supplier: inventoryData.supplier,
                notes: inventoryData.notes,
                created_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            const doc = await docRef.get();
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            throw error;
        }
    }

    static async getInventory(userId) {
        try {
            const snapshot = await db.collection('inventory')
                .where('user_id', '==', userId)
                .orderBy('created_at', 'desc')
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            throw error;
        }
    }

    static async updateInventoryItem(id, inventoryData) {
        try {
            await db.collection('inventory').doc(id).update({
                name: inventoryData.name,
                category: inventoryData.category,
                quantity: parseInt(inventoryData.quantity),
                unit_price: parseFloat(inventoryData.unitPrice),
                supplier: inventoryData.supplier,
                notes: inventoryData.notes,
                updated_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            const doc = await db.collection('inventory').doc(id).get();
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            throw error;
        }
    }

    static async deleteInventoryItem(id) {
        try {
            await db.collection('inventory').doc(id).delete();
            return { success: true };
        } catch (error) {
            throw error;
        }
    }

    // Lista de Preços/Vendas
    static async createSalesItem(salesData) {
        try {
            const docRef = await db.collection('sales_list').add({
                user_id: salesData.userId,
                service_name: salesData.serviceName,
                price: parseFloat(salesData.price),
                cost: parseFloat(salesData.cost || 0),
                profit_margin: parseFloat(salesData.profitMargin || 0),
                notes: salesData.notes,
                created_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            const doc = await docRef.get();
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            throw error;
        }
    }

    static async getSalesList(userId) {
        try {
            const snapshot = await db.collection('sales_list')
                .where('user_id', '==', userId)
                .orderBy('created_at', 'desc')
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            throw error;
        }
    }

    static async updateSalesItem(id, salesData) {
        try {
            await db.collection('sales_list').doc(id).update({
                service_name: salesData.serviceName,
                price: parseFloat(salesData.price),
                cost: parseFloat(salesData.cost || 0),
                profit_margin: parseFloat(salesData.profitMargin || 0),
                notes: salesData.notes,
                updated_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            const doc = await db.collection('sales_list').doc(id).get();
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            throw error;
        }
    }

    static async deleteSalesItem(id) {
        try {
            await db.collection('sales_list').doc(id).delete();
            return { success: true };
        } catch (error) {
            throw error;
        }
    }
}

// Exportar para uso global
window.DatabaseService = DatabaseService;
```

## Instruções para usar no Lovable:

1. **Copie o arquivo `styles.css` e `script.js` existentes** (eles não precisam de modificação)

2. **Use o `index.html` e `firebase.js` acima** (já atualizados para Firebase)

3. **Configure o Firebase:**
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
   - Ative Authentication (Email/Password)
   - Ative Firestore Database
   - Substitua as configurações no `firebase.js` pelas suas credenciais reais

4. **Vantagens do Firebase:**
   - ✅ Mais estável que Supabase
   - ✅ Autenticação integrada
   - ✅ Banco de dados em tempo real
   - ✅ Gratuito até 50.000 operações/dia
   - ✅ Interface de administração
   - ✅ Backup automático

O sistema está pronto para uso com Firebase! 🔥