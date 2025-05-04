import { auth, error } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const errorMessage = document.getElementById('error-message');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // 密碼確認驗證
        if (password !== confirmPassword) {
            error.show('兩次輸入的密碼不一致');
            return;
        }

        // 密碼強度驗證
        if (password.length < 6) {
            error.show('密碼長度至少為 6 個字符');
            return;
        }

        try {
            await auth.signup(username, password);
            window.location.href = 'login.html';
        } catch (err) {
            error.show(err.error || '註冊失敗');
        }
    });
}); 