// Configuração de usuário padrão para o sistema
// Este arquivo contém as credenciais de login salvas

const DEFAULT_USER_CONFIG = {
    email: 'Bruno.g.reis@gmail.com',
    password: 'Cambota2205',
    autoLogin: true,
    rememberMe: true
};

// Função para pré-preencher o formulário de login
function preloadUserCredentials() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember-me');
    
    if (emailInput && passwordInput) {
        emailInput.value = DEFAULT_USER_CONFIG.email;
        passwordInput.value = DEFAULT_USER_CONFIG.password;
        
        if (rememberCheckbox) {
            rememberCheckbox.checked = DEFAULT_USER_CONFIG.rememberMe;
        }
        
        // Auto-login se configurado
        if (DEFAULT_USER_CONFIG.autoLogin) {
            // Aguarda um pequeno delay para garantir que todos os elementos estejam carregados
            setTimeout(() => {
                const loginForm = document.getElementById('loginForm');
                if (loginForm) {
                    // Simula o clique no botão de login
                    const loginButton = loginForm.querySelector('button[type="submit"]');
                    if (loginButton) {
                        loginButton.click();
                    }
                }
            }, 500);
        }
    }
}

// Exporta a configuração para uso global
if (typeof window !== 'undefined') {
    window.DEFAULT_USER_CONFIG = DEFAULT_USER_CONFIG;
    window.preloadUserCredentials = preloadUserCredentials;
}