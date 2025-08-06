// Configuração do Supabase
const SUPABASE_URL = 'https://kabjljylbhdxobclbspj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthYmpsanlsYmhkeG9iY2xic3BqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzY4OTIsImV4cCI6MjA3MDAxMjg5Mn0.L9QTmTY3H7Y5z5WbOUul99NYeFmPFiExDhr0xQqsM1U';

// Inicializar cliente Supabase
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Funções de banco de dados
class DatabaseService {
    // Usuários
    static async createUser(userData) {
        const { data, error } = await supabaseClient
            .from('users')
            .insert([{
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                password: userData.password, // Em produção, usar hash
                created_at: new Date().toISOString()
            }])
            .select();
        
        if (error) throw error;
        return data[0];
    }

    static async loginUser(email, password) {
        const { data, error } = await supabaseClient
            .from('users')
            .select('*')
            .eq('email', email)
            .eq('password', password) // Em produção, verificar hash
            .single();
        
        if (error) throw error;
        return data;
    }

    // Serviços
    static async createService(serviceData) {
        const { data, error } = await supabaseClient
            .from('services')
            .insert([{
                user_id: serviceData.userId,
                date: serviceData.date,
                type: serviceData.type,
                lock_model: serviceData.lockModel,
                value: serviceData.value,
                notes: serviceData.notes,
                created_at: new Date().toISOString()
            }])
            .select();
        
        if (error) throw error;
        return data[0];
    }

    static async getServices(userId) {
        const { data, error } = await supabaseClient
            .from('services')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false });
        
        if (error) throw error;
        return data;
    }

    static async updateService(id, serviceData) {
        const { data, error } = await supabaseClient
            .from('services')
            .update({
                date: serviceData.date,
                type: serviceData.type,
                lock_model: serviceData.lockModel,
                value: serviceData.value,
                notes: serviceData.notes
            })
            .eq('id', id)
            .select();
        
        if (error) throw error;
        return data[0];
    }

    static async deleteService(id) {
        const { error } = await supabaseClient
            .from('services')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
    }

    // Despesas
    static async createExpense(expenseData) {
        const { data, error } = await supabaseClient
            .from('expenses')
            .insert([{
                user_id: expenseData.userId,
                date: expenseData.date,
                type: expenseData.type,
                description: expenseData.description,
                value: expenseData.value,
                created_at: new Date().toISOString()
            }])
            .select();
        
        if (error) throw error;
        return data[0];
    }

    static async getExpenses(userId) {
        const { data, error } = await supabaseClient
            .from('expenses')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false });
        
        if (error) throw error;
        return data;
    }

    static async updateExpense(id, expenseData) {
        const { data, error } = await supabaseClient
            .from('expenses')
            .update({
                date: expenseData.date,
                type: expenseData.type,
                description: expenseData.description,
                value: expenseData.value
            })
            .eq('id', id)
            .select();
        
        if (error) throw error;
        return data[0];
    }

    static async deleteExpense(id) {
        const { error } = await supabaseClient
            .from('expenses')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
    }

    // Estoque
    static async createInventoryItem(inventoryData) {
        const { data, error } = await supabaseClient
            .from('inventory')
            .insert([{
                user_id: inventoryData.userId,
                name: inventoryData.name,
                category: inventoryData.category,
                quantity: inventoryData.quantity,
                cost: inventoryData.cost,
                price: inventoryData.price,
                notes: inventoryData.notes,
                created_at: new Date().toISOString()
            }])
            .select();
        
        if (error) throw error;
        return data[0];
    }

    static async getInventory(userId) {
        const { data, error } = await supabaseClient
            .from('inventory')
            .select('*')
            .eq('user_id', userId)
            .order('name', { ascending: true });
        
        if (error) throw error;
        return data;
    }

    static async updateInventoryItem(id, inventoryData) {
        const { data, error } = await supabaseClient
            .from('inventory')
            .update({
                name: inventoryData.name,
                category: inventoryData.category,
                quantity: inventoryData.quantity,
                cost: inventoryData.cost,
                price: inventoryData.price,
                notes: inventoryData.notes
            })
            .eq('id', id)
            .select();
        
        if (error) throw error;
        return data[0];
    }

    static async deleteInventoryItem(id) {
        const { error } = await supabaseClient
            .from('inventory')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
    }

    // Lista de Preços
    static async createSalesItem(salesData) {
        const { data, error } = await supabaseClient
            .from('sales_list')
            .insert([{
                user_id: salesData.userId,
                service_name: salesData.serviceName,
                category: salesData.category,
                price: salesData.price,
                time: salesData.time,
                description: salesData.description,
                created_at: new Date().toISOString()
            }])
            .select();
        
        if (error) throw error;
        return data[0];
    }

    static async getSalesList(userId) {
        const { data, error } = await supabaseClient
            .from('sales_list')
            .select('*')
            .eq('user_id', userId)
            .order('service_name', { ascending: true });
        
        if (error) throw error;
        return data;
    }

    static async updateSalesItem(id, salesData) {
        const { data, error } = await supabaseClient
            .from('sales_list')
            .update({
                service_name: salesData.serviceName,
                category: salesData.category,
                price: salesData.price,
                time: salesData.time,
                description: salesData.description
            })
            .eq('id', id)
            .select();
        
        if (error) throw error;
        return data[0];
    }

    static async deleteSalesItem(id) {
        const { error } = await supabaseClient
            .from('sales_list')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
    }
}

// Exportar para uso global
window.DatabaseService = DatabaseService;
