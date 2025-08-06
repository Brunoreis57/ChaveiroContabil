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