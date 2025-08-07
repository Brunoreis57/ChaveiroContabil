// Dados globais
let currentUser = null;

// Usuário pré-cadastrado
const preRegisteredUser = {
    email: 'bruno.g.reis@gmail.com',
    password: 'Cambota2205',
    name: 'Bruno Reis',
    phone: '(11) 99999-9999',
    id: 'user_bruno_reis_001'
};
let services = [];
let expenses = [];
let inventory = [];
let salesList = [];
let charts = {};

// Configurações
const CONFIG = {
    serviceTypes: ['Abertura', 'Instalação', 'Cópia', 'Troca de fechadura', 'Troca de segredo'],
    lockModels: ['Stam', 'Pado', 'Papaiz', 'Tetra', 'Blindex', 'IFR7000', 'HDL', 'Digital'],
    expenseTypes: ['Combustível', 'Anúncios', 'Materiais', 'Outros']
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadStoredData();
    
    // Event listeners para estoque
    const inventoryForm = document.getElementById('inventoryForm');
    if (inventoryForm) {
        inventoryForm.addEventListener('submit', handleInventorySubmit);
    }
    
    // Event listeners para vendas
    const salesForm = document.getElementById('salesForm');
    if (salesForm) {
        salesForm.addEventListener('submit', handleSalesSubmit);
    }
    
    // Pré-carrega as credenciais do usuário se disponível
    if (typeof preloadUserCredentials === 'function') {
        preloadUserCredentials();
    }
    
    // Auto-preencher credenciais do usuário pré-cadastrado
    setTimeout(preloadPreRegisteredCredentials, 100);
    
    console.log('🔗 Sistema inicializado com localStorage');
});

function initializeApp() {
    // Verificar se há usuário logado
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        showMainApp();
    } else {
        showLoginScreen();
    }
    
    // Configurar data atual nos formulários
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('serviceDate').value = today;
    document.getElementById('expenseDate').value = today;
}

function setupEventListeners() {
    // Formulários de autenticação
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    
    // Formulários de dados
    document.getElementById('serviceForm').addEventListener('submit', handleServiceSubmit);
    document.getElementById('expenseForm').addEventListener('submit', handleExpenseSubmit);
    
    // Navegação será configurada após o login em setupNavigationListeners()
    
    // Filtros
    document.getElementById('reportPeriod').addEventListener('change', updateReports);
    
    // Fechar modais ao clicar fora
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Autocomplete personalizado
    setupAutocomplete();
}

function setupAutocomplete() {
    const serviceTypeInput = document.getElementById('serviceType');
    const lockModelInput = document.getElementById('lockModel');
    
    // Adicionar sugestões baseadas no histórico
    serviceTypeInput.addEventListener('input', function() {
        updateDatalist('serviceTypes', getUniqueServiceTypes());
    });
    
    lockModelInput.addEventListener('input', function() {
        updateDatalist('lockModels', getUniqueLockModels());
    });
}

function updateDatalist(listId, options) {
    const datalist = document.getElementById(listId);
    datalist.innerHTML = '';
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        datalist.appendChild(optionElement);
    });
}

function getUniqueServiceTypes() {
    const types = [...CONFIG.serviceTypes];
    services.forEach(service => {
        if (!types.includes(service.type)) {
            types.push(service.type);
        }
    });
    return types.sort();
}

function getUniqueLockModels() {
    const models = [...CONFIG.lockModels];
    services.forEach(service => {
        if (!models.includes(service.lockModel)) {
            models.push(service.lockModel);
        }
    });
    return models.sort();
}

// Autenticação
function showLogin() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-btn')[0].classList.add('active');
}

function showRegister() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-btn')[1].classList.add('active');
}

function handleLogin(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value.trim();
    const password = e.target.querySelector('input[type="password"]').value.trim();
    
    try {
        // Verificar se é o usuário pré-cadastrado (comparação case-insensitive para email)
        if (email.toLowerCase() === preRegisteredUser.email.toLowerCase() && password === preRegisteredUser.password) {
            currentUser = {
                id: preRegisteredUser.id,
                name: preRegisteredUser.name,
                email: preRegisteredUser.email,
                phone: preRegisteredUser.phone
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showMainApp();
            showNotification('Login realizado com sucesso! Bem-vindo, ' + currentUser.name, 'success');
            return;
        }
        
        // Verificar usuários cadastrados localmente
        const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const user = storedUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        
        if (user) {
            currentUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showMainApp();
            showNotification('Login realizado com sucesso! Bem-vindo, ' + currentUser.name, 'success');
        } else {
            showNotification('Email ou senha incorretos!', 'error');
        }
    } catch (error) {
        console.error('Erro no login:', error);
        showNotification('Email ou senha incorretos!', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const inputs = e.target.querySelectorAll('input');
    const userData = {
        name: inputs[0].value.trim(),
        email: inputs[1].value.trim(),
        phone: inputs[2].value.trim(),
        password: inputs[3].value,
        confirmPassword: inputs[4].value
    };
    
    if (userData.password !== userData.confirmPassword) {
        showNotification('As senhas não coincidem!', 'error');
        return;
    }
    
    try {
        // Verificar se o email já está cadastrado
        const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const emailExists = storedUsers.some(u => u.email.toLowerCase() === userData.email.toLowerCase());
        
        if (emailExists) {
            showNotification('Este email já está cadastrado!', 'error');
            return;
        }
        
        // Criar novo usuário
        const newUser = {
            id: generateId(),
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            password: userData.password,
            createdAt: new Date().toISOString()
        };
        
        // Salvar no localStorage
        storedUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(storedUsers));
        
        showNotification('Cadastro realizado com sucesso!', 'success');
        showLogin();
        console.log('✅ Usuário cadastrado no localStorage:', { id: newUser.id, name: newUser.name, email: newUser.email });
    } catch (error) {
        console.error('Erro no cadastro:', error);
        showNotification('Erro ao criar conta. Tente novamente.', 'error');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showLoginScreen();
    showNotification('Logout realizado com sucesso!', 'success');
}

function showLoginScreen() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
}

function showMainApp() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    document.getElementById('userName').textContent = currentUser.name;
    
    // Configurar event listeners de navegação após mostrar o mainApp
    setupNavigationListeners();
    
    navigateToSection('dashboard');
    updateDashboard();
}

function setupNavigationListeners() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach((item) => {
        // Remover listeners existentes para evitar duplicação
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
        
        newItem.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            navigateToSection(newItem.dataset.section);
        });
    });
}

// Navegação
function navigateToSection(section) {
    // Atualizar navegação
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    // Atualizar seções
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(`${section}Section`).classList.add('active');
    
    // Atualizar título
    const titles = {
        dashboard: 'Resumo',
        services: 'Serviços',
        expenses: 'Despesas',
        reports: 'Relatórios',
        inventory: 'Estoque',
        sales: 'Lista de Preços'
    };
    document.getElementById('pageTitle').textContent = titles[section];
    
    // Fechar menu mobile após navegação
    const sidebar = document.querySelector('.sidebar');
    if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }
    
    // Carregar dados específicos da seção
    switch(section) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'services':
            loadServices();
            break;
        case 'expenses':
            loadExpenses();
            break;
        case 'reports':
            updateReports();
            break;
        case 'inventory':
            loadInventory();
            break;
        case 'sales':
            loadSales();
            break;
    }
}

function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('open');
}

// Gerenciamento de dados com localStorage
function loadStoredData() {
    const userId = currentUser?.id;
    if (userId) {
        try {
            // Carregar dados do localStorage
            const storedServices = localStorage.getItem(`services_${userId}`);
            const storedExpenses = localStorage.getItem(`expenses_${userId}`);
            const storedInventory = localStorage.getItem(`inventory_${userId}`);
            const storedSalesList = localStorage.getItem(`salesList_${userId}`);
            
            services = storedServices ? JSON.parse(storedServices) : [];
            expenses = storedExpenses ? JSON.parse(storedExpenses) : [];
            inventory = storedInventory ? JSON.parse(storedInventory) : [];
            salesList = storedSalesList ? JSON.parse(storedSalesList) : [];
            
            console.log('✅ Dados carregados do localStorage:', {
                services: services.length,
                expenses: expenses.length,
                inventory: inventory.length,
                salesList: salesList.length
            });
        } catch (error) {
            console.error('Erro ao carregar dados do localStorage:', error);
            showNotification('Erro ao carregar dados locais', 'error');
        }
    }
}

// Função para salvar dados no localStorage
function saveDataToLocalStorage() {
    const userId = currentUser?.id;
    if (userId) {
        try {
            localStorage.setItem(`services_${userId}`, JSON.stringify(services));
            localStorage.setItem(`expenses_${userId}`, JSON.stringify(expenses));
            localStorage.setItem(`inventory_${userId}`, JSON.stringify(inventory));
            localStorage.setItem(`salesList_${userId}`, JSON.stringify(salesList));
            console.log('✅ Dados salvos no localStorage');
        } catch (error) {
            console.error('Erro ao salvar dados no localStorage:', error);
        }
    }
}

// Função para gerar IDs únicos
function generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Função saveData não é mais necessária pois salvamos diretamente no banco

// Serviços
function showServiceModal() {
    document.getElementById('serviceModal').classList.add('show');
    document.getElementById('serviceForm').reset();
    document.getElementById('serviceDate').value = new Date().toISOString().split('T')[0];
}

function handleServiceSubmit(e) {
    e.preventDefault();
    
    const serviceData = {
        id: generateId(),
        date: document.getElementById('serviceDate').value,
        type: document.getElementById('serviceType').value,
        lockModel: document.getElementById('lockModel').value,
        value: parseFloat(document.getElementById('serviceValue').value),
        notes: document.getElementById('serviceNotes').value,
        userId: currentUser.id,
        createdAt: new Date().toISOString()
    };
    
    try {
        // Adicionar à lista local
        services.push(serviceData);
        
        // Salvar no localStorage
        saveDataToLocalStorage();
        
        closeModal('serviceModal');
        loadServices();
        updateDashboard();
        showNotification('Serviço adicionado com sucesso!', 'success');
        console.log('✅ Serviço salvo no localStorage:', serviceData);
    } catch (error) {
        console.error('Erro ao adicionar serviço:', error);
        showNotification('Erro ao adicionar serviço. Tente novamente.', 'error');
    }
}

function loadServices() {
    const container = document.getElementById('servicesList');
    
    if (services.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tools"></i>
                <h3>Nenhum serviço cadastrado</h3>
                <p>Adicione seu primeiro serviço para começar</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = services.map(service => `
        <div class="service-item">
            <div class="item-header">
                <div class="item-title">${service.type}</div>
                <div class="item-value">R$ ${service.value.toFixed(2)}</div>
            </div>
            <div class="item-details">
                <div class="item-detail">
                    <label>Data</label>
                    <span>${formatDate(service.date)}</span>
                </div>
                <div class="item-detail">
                    <label>Modelo</label>
                    <span>${service.lockModel}</span>
                </div>
                ${service.notes ? `
                    <div class="item-detail">
                        <label>Observações</label>
                        <span>${service.notes}</span>
                    </div>
                ` : ''}
            </div>
            <div class="item-actions">
                <button class="edit-btn" onclick="editService('${service.id}')">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="delete-btn" onclick="deleteService('${service.id}')">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        </div>
    `).join('');
}

function filterServices() {
    const date = document.getElementById('serviceFilterDate').value;
    const type = document.getElementById('serviceFilterType').value;
    const model = document.getElementById('serviceFilterModel').value.toLowerCase();
    
    let filtered = services;
    
    if (date) {
        filtered = filtered.filter(service => service.date === date);
    }
    
    if (type) {
        filtered = filtered.filter(service => service.type === type);
    }
    
    if (model) {
        filtered = filtered.filter(service => 
            service.lockModel.toLowerCase().includes(model)
        );
    }
    
    const container = document.getElementById('servicesList');
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>Nenhum serviço encontrado</h3>
                <p>Tente ajustar os filtros</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(service => `
        <div class="service-item">
            <div class="item-header">
                <div class="item-title">${service.type}</div>
                <div class="item-value">R$ ${service.value.toFixed(2)}</div>
            </div>
            <div class="item-details">
                <div class="item-detail">
                    <label>Data</label>
                    <span>${formatDate(service.date)}</span>
                </div>
                <div class="item-detail">
                    <label>Modelo</label>
                    <span>${service.lockModel}</span>
                </div>
                ${service.notes ? `
                    <div class="item-detail">
                        <label>Observações</label>
                        <span>${service.notes}</span>
                    </div>
                ` : ''}
            </div>
            <div class="item-actions">
                <button class="edit-btn" onclick="editService('${service.id}')">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="delete-btn" onclick="deleteService('${service.id}')">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        </div>
    `).join('');
}

function deleteService(id) {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
        try {
            services = services.filter(service => service.id !== id);
            saveDataToLocalStorage();
            loadServices();
            updateDashboard();
            showNotification('Serviço excluído com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao excluir serviço:', error);
            showNotification('Erro ao excluir serviço. Tente novamente.', 'error');
        }
    }
}

// Despesas
function showExpenseModal() {
    document.getElementById('expenseModal').classList.add('show');
    document.getElementById('expenseForm').reset();
    document.getElementById('expenseDate').value = new Date().toISOString().split('T')[0];
}

function handleExpenseSubmit(e) {
    e.preventDefault();
    
    const expenseData = {
        id: generateId(),
        date: document.getElementById('expenseDate').value,
        type: document.getElementById('expenseType').value,
        description: document.getElementById('expenseDescription').value,
        value: parseFloat(document.getElementById('expenseValue').value),
        userId: currentUser.id,
        createdAt: new Date().toISOString()
    };
    
    try {
        // Adicionar à lista local
        expenses.push(expenseData);
        
        // Salvar no localStorage
        saveDataToLocalStorage();
        
        closeModal('expenseModal');
        loadExpenses();
        updateDashboard();
        showNotification('Despesa adicionada com sucesso!', 'success');
        console.log('✅ Despesa salva no localStorage:', expenseData);
    } catch (error) {
        console.error('Erro ao adicionar despesa:', error);
        showNotification('Erro ao adicionar despesa. Tente novamente.', 'error');
    }
}

function loadExpenses() {
    const container = document.getElementById('expensesList');
    
    if (expenses.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-receipt"></i>
                <h3>Nenhuma despesa cadastrada</h3>
                <p>Adicione sua primeira despesa para começar</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = expenses.map(expense => `
        <div class="expense-item">
            <div class="item-header">
                <div class="item-title">${expense.description}</div>
                <div class="item-value">R$ ${expense.value.toFixed(2)}</div>
            </div>
            <div class="item-details">
                <div class="item-detail">
                    <label>Data</label>
                    <span>${formatDate(expense.date)}</span>
                </div>
                <div class="item-detail">
                    <label>Tipo</label>
                    <span>${expense.type}</span>
                </div>
            </div>
            <div class="item-actions">
                <button class="edit-btn" onclick="editExpense('${expense.id}')">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="delete-btn" onclick="deleteExpense('${expense.id}')">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        </div>
    `).join('');
}

function filterExpenses() {
    const date = document.getElementById('expenseFilterDate').value;
    const type = document.getElementById('expenseFilterType').value;
    
    let filtered = expenses;
    
    if (date) {
        filtered = filtered.filter(expense => expense.date === date);
    }
    
    if (type) {
        filtered = filtered.filter(expense => expense.type === type);
    }
    
    const container = document.getElementById('expensesList');
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>Nenhuma despesa encontrada</h3>
                <p>Tente ajustar os filtros</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(expense => `
        <div class="expense-item">
            <div class="item-header">
                <div class="item-title">${expense.description}</div>
                <div class="item-value">R$ ${expense.value.toFixed(2)}</div>
            </div>
            <div class="item-details">
                <div class="item-detail">
                    <label>Data</label>
                    <span>${formatDate(expense.date)}</span>
                </div>
                <div class="item-detail">
                    <label>Tipo</label>
                    <span>${expense.type}</span>
                </div>
            </div>
            <div class="item-actions">
                <button class="edit-btn" onclick="editExpense('${expense.id}')">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="delete-btn" onclick="deleteExpense('${expense.id}')">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        </div>
    `).join('');
}

function deleteExpense(id) {
    if (confirm('Tem certeza que deseja excluir esta despesa?')) {
        try {
            expenses = expenses.filter(expense => expense.id !== id);
            saveDataToLocalStorage();
            loadExpenses();
            updateDashboard();
            showNotification('Despesa excluída com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao excluir despesa:', error);
            showNotification('Erro ao excluir despesa. Tente novamente.', 'error');
        }
    }
}

// Dashboard
function updateDashboard() {
    updateStats();
    updateCharts();
}

function updateStats() {
    const today = new Date().toISOString().split('T')[0];
    const weekStart = getWeekStart();
    const monthStart = getMonthStart();
    
    // Receitas
    const todayRevenue = calculateRevenue(today, today);
    const weekRevenue = calculateRevenue(weekStart, today);
    const monthRevenue = calculateRevenue(monthStart, today);
    
    // Despesas do mês
    const monthExpenses = calculateExpenses(monthStart, today);
    const monthProfit = monthRevenue - monthExpenses;
    
    // Atualizar elementos
    document.getElementById('todayRevenue').textContent = `R$ ${todayRevenue.toFixed(2)}`;
    document.getElementById('weekRevenue').textContent = `R$ ${weekRevenue.toFixed(2)}`;
    document.getElementById('monthRevenue').textContent = `R$ ${monthRevenue.toFixed(2)}`;
    document.getElementById('monthProfit').textContent = `R$ ${monthProfit.toFixed(2)}`;
    
    // Colorir lucro
    const profitElement = document.getElementById('monthProfit');
    profitElement.className = monthProfit >= 0 ? 'stat-value success' : 'stat-value error';
}

function updateCharts() {
    updateRevenueChart();
    updateServicesChart();
}

function updateRevenueChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    
    if (charts.revenue) {
        charts.revenue.destroy();
    }
    
    const last7Days = getLast7Days();
    const revenueData = last7Days.map(date => calculateRevenue(date, date));
    const expenseData = last7Days.map(date => calculateExpenses(date, date));
    
    charts.revenue = new Chart(ctx, {
        type: 'line',
        data: {
            labels: last7Days.map(date => formatDate(date, 'short')),
            datasets: [{
                label: 'Receitas',
                data: revenueData,
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Despesas',
                data: expenseData,
                borderColor: '#ff4444',
                backgroundColor: 'rgba(255, 68, 68, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#e0e0e0'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#888'
                    },
                    grid: {
                        color: '#333'
                    }
                },
                y: {
                    ticks: {
                        color: '#888',
                        callback: function(value) {
                            return 'R$ ' + value.toFixed(0);
                        }
                    },
                    grid: {
                        color: '#333'
                    }
                }
            }
        }
    });
}

function updateServicesChart() {
    const ctx = document.getElementById('servicesChart').getContext('2d');
    
    if (charts.services) {
        charts.services.destroy();
    }
    
    const serviceCount = {};
    services.forEach(service => {
        serviceCount[service.type] = (serviceCount[service.type] || 0) + 1;
    });
    
    const labels = Object.keys(serviceCount);
    const data = Object.values(serviceCount);
    
    if (labels.length === 0) {
        ctx.fillStyle = '#666';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Nenhum dado disponível', ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }
    
    charts.services = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#4CAF50',
                    '#2196F3',
                    '#FF9800',
                    '#9C27B0',
                    '#F44336',
                    '#00BCD4',
                    '#FFEB3B',
                    '#795548'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#e0e0e0',
                        padding: 20
                    }
                }
            }
        }
    });
}

// Relatórios
function updateReports() {
    const period = document.getElementById('reportPeriod').value;
    const { startDate, endDate } = getPeriodDates(period);
    
    const totalRevenue = calculateRevenue(startDate, endDate);
    const totalExpenses = calculateExpenses(startDate, endDate);
    const profit = totalRevenue - totalExpenses;
    
    document.getElementById('reportRevenue').textContent = `R$ ${totalRevenue.toFixed(2)}`;
    document.getElementById('reportExpenses').textContent = `R$ ${totalExpenses.toFixed(2)}`;
    document.getElementById('reportProfit').textContent = `R$ ${profit.toFixed(2)}`;
    
    // Colorir lucro
    const profitElement = document.getElementById('reportProfit');
    profitElement.className = profit >= 0 ? 'success' : 'error';
    
    updateTopServices(startDate, endDate);
    updateExpenseBreakdown(startDate, endDate);
}

function updateTopServices(startDate, endDate) {
    const periodServices = services.filter(service => 
        service.date >= startDate && service.date <= endDate
    );
    
    const serviceCount = {};
    const serviceRevenue = {};
    
    periodServices.forEach(service => {
        serviceCount[service.type] = (serviceCount[service.type] || 0) + 1;
        serviceRevenue[service.type] = (serviceRevenue[service.type] || 0) + service.value;
    });
    
    const sortedServices = Object.entries(serviceCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);
    
    const container = document.getElementById('topServices');
    
    if (sortedServices.length === 0) {
        container.innerHTML = '<p style="color: #666; text-align: center;">Nenhum serviço no período</p>';
        return;
    }
    
    container.innerHTML = sortedServices.map(([type, count]) => `
        <div class="report-item">
            <span>${type}</span>
            <span>${count}x (R$ ${serviceRevenue[type].toFixed(2)})</span>
        </div>
    `).join('');
}

function updateExpenseBreakdown(startDate, endDate) {
    const periodExpenses = expenses.filter(expense => 
        expense.date >= startDate && expense.date <= endDate
    );
    
    const expenseByType = {};
    
    periodExpenses.forEach(expense => {
        expenseByType[expense.type] = (expenseByType[expense.type] || 0) + expense.value;
    });
    
    const sortedExpenses = Object.entries(expenseByType)
        .sort(([,a], [,b]) => b - a);
    
    const container = document.getElementById('expenseBreakdown');
    
    if (sortedExpenses.length === 0) {
        container.innerHTML = '<p style="color: #666; text-align: center;">Nenhuma despesa no período</p>';
        return;
    }
    
    container.innerHTML = sortedExpenses.map(([type, value]) => `
        <div class="report-item">
            <span>${type}</span>
            <span>R$ ${value.toFixed(2)}</span>
        </div>
    `).join('');
}

// Utilitários
function calculateRevenue(startDate, endDate) {
    return services
        .filter(service => service.date >= startDate && service.date <= endDate)
        .reduce((total, service) => total + service.value, 0);
}

function calculateExpenses(startDate, endDate) {
    return expenses
        .filter(expense => expense.date >= startDate && expense.date <= endDate)
        .reduce((total, expense) => total + expense.value, 0);
}

function getWeekStart() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek;
    const weekStart = new Date(today.setDate(diff));
    return weekStart.toISOString().split('T')[0];
}

function getMonthStart() {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
}

function getLast7Days() {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
}

function getPeriodDates(period) {
    const today = new Date();
    let startDate, endDate;
    
    switch(period) {
        case 'month':
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            endDate = today;
            break;
        case 'quarter':
            const quarterStart = Math.floor(today.getMonth() / 3) * 3;
            startDate = new Date(today.getFullYear(), quarterStart - 3, 1);
            endDate = today;
            break;
        case 'year':
            startDate = new Date(today.getFullYear(), 0, 1);
            endDate = today;
            break;
        default:
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            endDate = today;
    }
    
    return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
    };
}

function formatDate(dateString, format = 'long') {
    const date = new Date(dateString + 'T00:00:00');
    
    if (format === 'short') {
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }
    
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Modais
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Notificações
function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#ff4444' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Adicionar estilos de animação para notificações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Dados de exemplo para demonstração
function loadSampleData() {
    // Primeiro carregar dados do localStorage
    loadStoredData();
    
    if (services.length === 0 && expenses.length === 0) {
        // Adicionar alguns dados de exemplo
        const sampleServices = [
            {
                id: '1',
                date: new Date().toISOString().split('T')[0],
                type: 'Abertura',
                lockModel: 'Stam',
                value: 80.00,
                notes: 'Abertura de emergência',
                userId: currentUser.id
            },
            {
                id: '2',
                date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
                type: 'Instalação',
                lockModel: 'Pado',
                value: 150.00,
                notes: 'Instalação completa',
                userId: currentUser.id
            }
        ];
        
        const sampleExpenses = [
            {
                id: '1',
                date: new Date().toISOString().split('T')[0],
                type: 'Combustível',
                description: 'Gasolina',
                value: 50.00,
                userId: currentUser.id
            }
        ];
        
        services.push(...sampleServices);
        expenses.push(...sampleExpenses);
        saveDataToLocalStorage();
    }
}

// Carregar dados de exemplo quando o usuário fizer login
const originalShowMainApp = showMainApp;
showMainApp = function() {
    originalShowMainApp();
    loadSampleData();
};

// ===== FUNÇÕES DE ESTOQUE =====
function showInventoryModal() {
    document.getElementById('inventoryModal').classList.add('show');
    document.getElementById('inventoryForm').reset();
}

function handleInventorySubmit(e) {
    e.preventDefault();
    
    const inventoryData = {
        id: generateId(),
        name: document.getElementById('inventoryName').value,
        category: document.getElementById('inventoryCategory').value,
        quantity: parseInt(document.getElementById('inventoryQuantity').value),
        cost: parseFloat(document.getElementById('inventoryCost').value),
        price: parseFloat(document.getElementById('inventoryPrice').value),
        notes: document.getElementById('inventoryNotes').value,
        userId: currentUser.id,
        createdAt: new Date().toISOString()
    };
    
    try {
        // Adicionar à lista local
        inventory.push(inventoryData);
        saveDataToLocalStorage();
        
        closeModal('inventoryModal');
        loadInventory();
        showNotification('Item adicionado ao estoque com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao adicionar item ao inventário:', error);
        showNotification('Erro ao adicionar item. Tente novamente.', 'error');
    }
}

function loadInventory() {
    const inventoryList = document.getElementById('inventoryList');
    
    if (inventory.length === 0) {
        inventoryList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-boxes"></i>
                <h3>Nenhum item no estoque</h3>
                <p>Adicione itens ao seu estoque para começar a gerenciar seu inventário.</p>
            </div>
        `;
        return;
    }
    
    inventoryList.innerHTML = inventory.map(item => `
        <div class="inventory-item">
            <div class="item-header">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <span class="item-category">${item.category}</span>
                </div>
                <div class="item-actions">
                    <button onclick="editInventoryItem(${item.id})" class="edit-btn">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteInventoryItem(${item.id})" class="delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="item-details">
                <div class="detail-item">
                    <span class="label">Quantidade:</span>
                    <span class="value">${item.quantity} unidades</span>
                </div>
                <div class="detail-item">
                    <span class="label">Custo:</span>
                    <span class="value">R$ ${item.cost.toFixed(2)}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Preço de Venda:</span>
                    <span class="value">R$ ${item.price.toFixed(2)}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Margem:</span>
                    <span class="value profit">${(((item.price - item.cost) / item.cost) * 100).toFixed(1)}%</span>
                </div>
            </div>
            ${item.notes ? `<div class="item-notes">${item.notes}</div>` : ''}
        </div>
    `).join('');
}

function filterInventory() {
    const nameFilter = document.getElementById('inventoryFilterName').value.toLowerCase();
    const categoryFilter = document.getElementById('inventoryFilterCategory').value;
    
    const filteredInventory = inventory.filter(item => {
        const matchesName = !nameFilter || item.name.toLowerCase().includes(nameFilter);
        const matchesCategory = !categoryFilter || item.category === categoryFilter;
        return matchesName && matchesCategory;
    });
    
    const inventoryList = document.getElementById('inventoryList');
    
    if (filteredInventory.length === 0) {
        inventoryList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>Nenhum item encontrado</h3>
                <p>Tente ajustar os filtros para encontrar o que procura.</p>
            </div>
        `;
        return;
    }
    
    inventoryList.innerHTML = filteredInventory.map(item => `
        <div class="inventory-item">
            <div class="item-header">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <span class="item-category">${item.category}</span>
                </div>
                <div class="item-actions">
                    <button onclick="editInventoryItem(${item.id})" class="edit-btn">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteInventoryItem(${item.id})" class="delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="item-details">
                <div class="detail-item">
                    <span class="label">Quantidade:</span>
                    <span class="value">${item.quantity} unidades</span>
                </div>
                <div class="detail-item">
                    <span class="label">Custo:</span>
                    <span class="value">R$ ${item.cost.toFixed(2)}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Preço de Venda:</span>
                    <span class="value">R$ ${item.price.toFixed(2)}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Margem:</span>
                    <span class="value profit">${(((item.price - item.cost) / item.cost) * 100).toFixed(1)}%</span>
                </div>
            </div>
            ${item.notes ? `<div class="item-notes">${item.notes}</div>` : ''}
        </div>
    `).join('');
}

function deleteInventoryItem(id) {
    if (confirm('Tem certeza que deseja excluir este item do estoque?')) {
        try {
            inventory = inventory.filter(item => item.id !== id);
            saveDataToLocalStorage();
            loadInventory();
            showNotification('Item removido do estoque!', 'success');
        } catch (error) {
            console.error('Erro ao excluir item do inventário:', error);
            showNotification('Erro ao excluir item. Tente novamente.', 'error');
        }
    }
}

// ===== FUNÇÕES DE LISTA DE PREÇOS =====
function showSalesModal() {
    document.getElementById('salesModal').classList.add('show');
    document.getElementById('salesForm').reset();
}

function handleSalesSubmit(e) {
    e.preventDefault();
    
    const salesData = {
        id: generateId(),
        date: document.getElementById('salesDate').value,
        item: document.getElementById('salesItem').value,
        quantity: parseInt(document.getElementById('salesQuantity').value),
        price: parseFloat(document.getElementById('salesPrice').value),
        total: parseInt(document.getElementById('salesQuantity').value) * parseFloat(document.getElementById('salesPrice').value),
        customer: document.getElementById('salesCustomer').value,
        notes: document.getElementById('salesNotes').value,
        userId: currentUser.id,
        createdAt: new Date().toISOString()
    };
    
    try {
        // Adicionar à lista local
        salesList.push(salesData);
        saveDataToLocalStorage();
        
        closeModal('salesModal');
        loadSales();
        showNotification('Venda registrada com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao registrar venda:', error);
        showNotification('Erro ao registrar venda. Tente novamente.', 'error');
    }
}

function loadSales() {
    const salesListElement = document.getElementById('salesList');
    
    if (salesList.length === 0) {
        salesListElement.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tags"></i>
                <h3>Nenhum serviço na lista</h3>
                <p>Adicione serviços à sua lista de preços para facilitar orçamentos.</p>
            </div>
        `;
        return;
    }
    
    salesListElement.innerHTML = salesList.map(service => `
        <div class="sales-item">
            <div class="item-header">
                <div class="item-info">
                    <h4>${service.serviceName}</h4>
                    <span class="item-category">${service.category}</span>
                </div>
                <div class="item-actions">
                    <button onclick="editSalesItem(${service.id})" class="edit-btn">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteSalesItem(${service.id})" class="delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="item-details">
                <div class="detail-item">
                    <span class="label">Preço:</span>
                    <span class="value price">R$ ${service.price.toFixed(2)}</span>
                </div>
                ${service.time ? `
                    <div class="detail-item">
                        <span class="label">Tempo Estimado:</span>
                        <span class="value">${service.time} min</span>
                    </div>
                ` : ''}
            </div>
            ${service.description ? `<div class="item-notes">${service.description}</div>` : ''}
        </div>
    `).join('');
}

function filterSales() {
    const serviceFilter = document.getElementById('salesFilterService').value.toLowerCase();
    const categoryFilter = document.getElementById('salesFilterCategory').value;
    
    const filteredSales = salesList.filter(service => {
        const matchesService = !serviceFilter || service.serviceName.toLowerCase().includes(serviceFilter);
        const matchesCategory = !categoryFilter || service.category === categoryFilter;
        return matchesService && matchesCategory;
    });
    
    const salesListElement = document.getElementById('salesList');
    
    if (filteredSales.length === 0) {
        salesListElement.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>Nenhum serviço encontrado</h3>
                <p>Tente ajustar os filtros para encontrar o que procura.</p>
            </div>
        `;
        return;
    }
    
    salesListElement.innerHTML = filteredSales.map(service => `
        <div class="sales-item">
            <div class="item-header">
                <div class="item-info">
                    <h4>${service.serviceName}</h4>
                    <span class="item-category">${service.category}</span>
                </div>
                <div class="item-actions">
                    <button onclick="editSalesItem(${service.id})" class="edit-btn">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteSalesItem(${service.id})" class="delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="item-details">
                <div class="detail-item">
                    <span class="label">Preço:</span>
                    <span class="value price">R$ ${service.price.toFixed(2)}</span>
                </div>
                ${service.time ? `
                    <div class="detail-item">
                        <span class="label">Tempo Estimado:</span>
                        <span class="value">${service.time} min</span>
                    </div>
                ` : ''}
            </div>
            ${service.description ? `<div class="item-notes">${service.description}</div>` : ''}
        </div>
    `).join('');
}

function deleteSalesItem(id) {
    if (confirm('Tem certeza que deseja excluir este serviço da lista?')) {
        try {
            salesList = salesList.filter(service => service.id !== id);
            saveDataToLocalStorage();
            loadSales();
            showNotification('Serviço removido da lista!', 'success');
        } catch (error) {
            console.error('Erro ao excluir venda:', error);
            showNotification('Erro ao excluir venda. Tente novamente.', 'error');
        }
    }
}

// Adicionar event listeners para os novos formulários
// Event listeners consolidados no bloco principal DOMContentLoaded acima

// Função para alternar visibilidade da senha
function togglePassword(button) {
    const passwordInput = button.parentElement.querySelector('input[type="password"], input[type="text"]');
    const icon = button.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Função para pré-carregar credenciais do usuário pré-cadastrado
function preloadPreRegisteredCredentials() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const emailField = loginForm.querySelector('input[type="email"]');
        const passwordField = loginForm.querySelector('input[type="password"]');
        
        if (emailField && passwordField) {
            emailField.value = preRegisteredUser.email;
            passwordField.value = preRegisteredUser.password;
            
            // Adicionar uma nota visual
            if (!document.querySelector('.pre-registered-note')) {
                const note = document.createElement('div');
                note.className = 'pre-registered-note';
                note.style.cssText = 'background: #e8f5e8; border: 1px solid #4caf50; padding: 10px; margin: 10px 0; border-radius: 5px; font-size: 14px; color: #2e7d32; text-align: center;';
                note.innerHTML = '✅ Usuário pré-cadastrado: ' + preRegisteredUser.email + ' (clique em Entrar)';
                loginForm.insertBefore(note, loginForm.firstChild);
            }
        }
    }
}

// Função para importar dados do Excel
function importExcelData() {
    const excelData = [
        { date: '2025-07-17', name: 'Tatiana', service: 'Fechadura Eletronica', value: 250, expense: null },
        { date: '2025-07-21', name: 'Vera', service: 'Troca Miolos Tetra', value: 240, expense: 87 },
        { date: '2025-07-21', name: 'Amanda', service: 'Reparo Fechadura', value: 150, expense: null },
        { date: '2025-07-23', name: 'Pedro', service: 'Fechadura + instalacao', value: 315, expense: 120 },
        { date: '2025-07-29', name: 'Juliana', service: 'Reparo Fechadura', value: 150, expense: 36 },
        { date: '2025-07-30', name: 'Giovana', service: 'Fechadura + instalacao', value: 240, expense: null },
        { date: '2025-07-01', name: 'Eduardo', service: 'Fechadura Eletronica', value: 300, expense: null },
        { date: '2025-07-02', name: 'Matheus L', service: 'Fechadura Eletronica', value: 350, expense: null },
        { date: '2025-07-02', name: 'Mateus S', service: 'Fechadura Eletronica', value: 350, expense: null }
    ];
    
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    
    showNotification('Iniciando importação dos dados...', 'info');
    
    for (const item of excelData) {
        try {
            // Criar serviço
            const serviceData = {
                id: generateId(),
                date: item.date,
                type: item.service,
                lockModel: 'Não especificado',
                value: item.value,
                notes: `Cliente: ${item.name}`,
                userId: currentUser.id,
                createdAt: new Date().toISOString()
            };
            
            // Adicionar à lista local
            services.push(serviceData);
            
            // Criar despesa se existir
            if (item.expense && item.expense > 0) {
                const expenseData = {
                    id: generateId(),
                    date: item.date,
                    type: 'Materiais',
                    description: `Materiais para serviço - ${item.name}`,
                    value: item.expense,
                    userId: currentUser.id,
                    createdAt: new Date().toISOString()
                };
                
                // Adicionar à lista local
                expenses.push(expenseData);
            }
            
            successCount++;
        } catch (error) {
            errorCount++;
            errors.push(`Erro ao importar ${item.name}: ${error.message}`);
            console.error(`Erro ao importar dados de ${item.name}:`, error);
        }
    }
    
    // Atualizar interface
    loadServices();
    loadExpenses();
    updateDashboard();
    
    // Mostrar resultado
    if (errorCount === 0) {
        showNotification(`Importação concluída com sucesso! ${successCount} registros importados.`, 'success');
    } else {
        showNotification(`Importação concluída com ${successCount} sucessos e ${errorCount} erros. Verifique o console para detalhes.`, 'warning');
        console.warn('Erros durante a importação:', errors);
    }
}

// Função para mostrar modal de importação
function showImportModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'importModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Importar Dados do Excel</h2>
                <span class="close" onclick="closeImportModal()">&times;</span>
            </div>
            <div class="modal-body">
                <p>Esta função irá importar os seguintes dados:</p>
                <ul>
                    <li>9 serviços realizados</li>
                    <li>4 despesas relacionadas</li>
                    <li>Dados de julho de 2025</li>
                </ul>
                <p><strong>Atenção:</strong> Os dados serão adicionados ao banco de dados atual.</p>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeImportModal()">Cancelar</button>
                    <button type="button" class="btn btn-primary" onclick="executeImport()">Importar Dados</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

// Função para fechar o modal de importação
function closeImportModal() {
    const modal = document.getElementById('importModal');
    if (modal) {
        modal.remove();
    }
}

// Função para executar a importação
function executeImport() {
    closeImportModal();
    importExcelData();
}