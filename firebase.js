// Configuração do Firebase
const firebaseConfig = {
    apiKey: "SUA_API_KEY_AQUI",
    authDomain: "SEU_PROJECT_ID.firebaseapp.com",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_PROJECT_ID.appspot.com",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    appId: "SEU_APP_ID"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Classe de Serviços do Banco de Dados Firebase
class DatabaseService {
    // USUÁRIOS
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

    static getCurrentUser() {
        return auth.currentUser;
    }

    static async logoutUser() {
        try {
            await auth.signOut();
            return true;
        } catch (error) {
            throw error;
        }
    }

    // SERVIÇOS
    static async createService(serviceData) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Usuário não autenticado');
            
            const docRef = await db.collection('services').add({
                user_id: user.uid,
                ...serviceData,
                created_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return { id: docRef.id, ...serviceData };
        } catch (error) {
            throw error;
        }
    }

    static async getServices() {
        try {
            const user = auth.currentUser;
            if (!user) return [];
            
            const snapshot = await db.collection('services')
                .where('user_id', '==', user.uid)
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

    static async updateService(id, updateData) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Usuário não autenticado');
            
            await db.collection('services').doc(id).update({
                ...updateData,
                updated_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return { id, ...updateData };
        } catch (error) {
            throw error;
        }
    }

    static async deleteService(id) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Usuário não autenticado');
            
            await db.collection('services').doc(id).delete();
            return true;
        } catch (error) {
            throw error;
        }
    }

    // DESPESAS
    static async createExpense(expenseData) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Usuário não autenticado');
            
            const docRef = await db.collection('expenses').add({
                user_id: user.uid,
                ...expenseData,
                created_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return { id: docRef.id, ...expenseData };
        } catch (error) {
            throw error;
        }
    }

    static async getExpenses() {
        try {
            const user = auth.currentUser;
            if (!user) return [];
            
            const snapshot = await db.collection('expenses')
                .where('user_id', '==', user.uid)
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

    static async updateExpense(id, updateData) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Usuário não autenticado');
            
            await db.collection('expenses').doc(id).update({
                ...updateData,
                updated_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return { id, ...updateData };
        } catch (error) {
            throw error;
        }
    }

    static async deleteExpense(id) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Usuário não autenticado');
            
            await db.collection('expenses').doc(id).delete();
            return true;
        } catch (error) {
            throw error;
        }
    }

    // ESTOQUE
    static async createStock(stockData) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Usuário não autenticado');
            
            const docRef = await db.collection('stock').add({
                user_id: user.uid,
                ...stockData,
                created_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return { id: docRef.id, ...stockData };
        } catch (error) {
            throw error;
        }
    }

    static async getStock() {
        try {
            const user = auth.currentUser;
            if (!user) return [];
            
            const snapshot = await db.collection('stock')
                .where('user_id', '==', user.uid)
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

    static async updateStock(id, updateData) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Usuário não autenticado');
            
            await db.collection('stock').doc(id).update({
                ...updateData,
                updated_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return { id, ...updateData };
        } catch (error) {
            throw error;
        }
    }

    static async deleteStock(id) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Usuário não autenticado');
            
            await db.collection('stock').doc(id).delete();
            return true;
        } catch (error) {
            throw error;
        }
    }

    // LISTA DE PREÇOS
    static async createPriceList(priceData) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Usuário não autenticado');
            
            const docRef = await db.collection('priceList').add({
                user_id: user.uid,
                ...priceData,
                created_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return { id: docRef.id, ...priceData };
        } catch (error) {
            throw error;
        }
    }

    static async getPriceList() {
        try {
            const user = auth.currentUser;
            if (!user) return [];
            
            const snapshot = await db.collection('priceList')
                .where('user_id', '==', user.uid)
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

    static async updatePriceList(id, updateData) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Usuário não autenticado');
            
            await db.collection('priceList').doc(id).update({
                ...updateData,
                updated_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return { id, ...updateData };
        } catch (error) {
            throw error;
        }
    }

    static async deletePriceList(id) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Usuário não autenticado');
            
            await db.collection('priceList').doc(id).delete();
            return true;
        } catch (error) {
            throw error;
        }
    }
}