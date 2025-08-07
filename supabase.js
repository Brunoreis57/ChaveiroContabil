// Configuração do Supabase
const SUPABASE_URL = 'https://vzdobzmacjzfclctzyha.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6ZG9iem1hY2p6ZmNsY3R6eWhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MzM1NTAsImV4cCI6MjA3MDEwOTU1MH0.-9xe4X-uTmXAQDgHyF05pE82ZOVhV4mHTfNhEk7DRaI';

// Inicializar Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Classe de Serviços do Banco de Dados Supabase
class DatabaseService {
    // VERIFICAÇÃO DE CONECTIVIDADE
    static async testConnection() {
        try {
            console.log('🔄 Testando conexão com Supabase...');
            
            const { data, error } = await supabase
                .from('profiles')
                .select('count')
                .limit(1);
            
            if (error) {
                console.error('❌ Erro na conexão com Supabase:', error);
                return { success: false, error: error.message };
            }
            
            console.log('✅ Conexão com Supabase estabelecida com sucesso!');
            return { success: true, message: 'Conectado ao Supabase' };
        } catch (error) {
            console.error('❌ Erro geral de conexão:', error);
            return { success: false, error: error.message };
        }
    }
    // USUÁRIOS
    static async createUser(userData) {
        try {
            // Criar usuário com autenticação do Supabase
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: userData.email,
                password: userData.password,
                options: {
                    data: {
                        name: userData.name,
                        phone: userData.phone
                    }
                }
            });

            if (authError) throw authError;

            // Salvar dados adicionais na tabela profiles
            if (authData.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: authData.user.id,
                        name: userData.name,
                        email: userData.email,
                        phone: userData.phone,
                        created_at: new Date().toISOString()
                    });

                if (profileError) throw profileError;
            }

            return {
                id: authData.user.id,
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
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            // Buscar dados adicionais do usuário
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

            if (profileError) throw profileError;

            return {
                id: data.user.id,
                name: profile.name,
                email: profile.email,
                phone: profile.phone
            };
        } catch (error) {
            throw error;
        }
    }

    static getCurrentUser() {
        return supabase.auth.getUser();
    }

    static async logoutUser() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            return true;
        } catch (error) {
            throw error;
        }
    }

    // SERVIÇOS
    static async createService(serviceData) {
        try {
            console.log('🔄 Tentando salvar serviço no Supabase:', serviceData);
            
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuário não autenticado');

            const { data, error } = await supabase
                .from('services')
                .insert({
                    ...serviceData,
                    user_id: user.id,
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) {
                console.error('❌ Erro ao salvar serviço no Supabase:', error);
                throw error;
            }
            
            console.log('✅ Serviço salvo com sucesso no Supabase:', data);
            return data;
        } catch (error) {
            console.error('❌ Erro geral ao criar serviço:', error);
            throw error;
        }
    }

    static async getServices() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuário não autenticado');

            const { data, error } = await supabase
                .from('services')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            throw error;
        }
    }

    static async updateService(id, updateData) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuário não autenticado');

            const { data, error } = await supabase
                .from('services')
                .update(updateData)
                .eq('id', id)
                .eq('user_id', user.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async deleteService(id) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuário não autenticado');

            const { error } = await supabase
                .from('services')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id);

            if (error) throw error;
            return true;
        } catch (error) {
            throw error;
        }
    }

    // DESPESAS
    static async createExpense(expenseData) {
        try {
            console.log('🔄 Tentando salvar despesa no Supabase:', expenseData);
            
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuário não autenticado');

            const { data, error } = await supabase
                .from('expenses')
                .insert({
                    ...expenseData,
                    user_id: user.id,
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) {
                console.error('❌ Erro ao salvar despesa no Supabase:', error);
                throw error;
            }
            
            console.log('✅ Despesa salva com sucesso no Supabase:', data);
            return data;
        } catch (error) {
            console.error('❌ Erro geral ao criar despesa:', error);
            throw error;
        }
    }

    static async getExpenses() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuário não autenticado');

            const { data, error } = await supabase
                .from('expenses')
                .select('*')
                .eq('user_id', user.id)
                .order('date', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            throw error;
        }
    }

    static async updateExpense(id, updateData) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuário não autenticado');

            const { data, error } = await supabase
                .from('expenses')
                .update(updateData)
                .eq('id', id)
                .eq('user_id', user.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async deleteExpense(id) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuário não autenticado');

            const { error } = await supabase
                .from('expenses')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id);

            if (error) throw error;
            return true;
        } catch (error) {
            throw error;
        }
    }

    // ESTOQUE
    static async createStock(stockData) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuário não autenticado');

            const { data, error } = await supabase
                .from('stock')
                .insert({
                    ...stockData,
                    user_id: user.id,
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async getStock() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuário não autenticado');

            const { data, error } = await supabase
                .from('stock')
                .select('*')
                .eq('user_id', user.id)
                .order('name', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (error) {
            throw error;
        }
    }

    static async updateStock(id, updateData) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuário não autenticado');

            const { data, error } = await supabase
                .from('stock')
                .update(updateData)
                .eq('id', id)
                .eq('user_id', user.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async deleteStock(id) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuário não autenticado');

            const { error } = await supabase
                .from('stock')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id);

            if (error) throw error;
            return true;
        } catch (error) {
            throw error;
        }
    }

    // LISTA DE PREÇOS
    static async createPriceList(priceData) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuário não autenticado');

            const { data, error } = await supabase
                .from('price_list')
                .insert({
                    ...priceData,
                    user_id: user.id,
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async getPriceList() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuário não autenticado');

            const { data, error } = await supabase
                .from('price_list')
                .select('*')
                .eq('user_id', user.id)
                .order('service_name', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (error) {
            throw error;
        }
    }

    static async updatePriceList(id, updateData) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuário não autenticado');

            const { data, error } = await supabase
                .from('price_list')
                .update(updateData)
                .eq('id', id)
                .eq('user_id', user.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async deletePriceList(id) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuário não autenticado');

            const { error } = await supabase
                .from('price_list')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id);

            if (error) throw error;
            return true;
        } catch (error) {
            throw error;
        }
    }
}
