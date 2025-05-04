import { auth, error } from './api.js';

console.log('login?');

document.addEventListener('DOMContentLoaded', () => {
  console.log('login??');

  const loginForm = document.querySelector('.login-form');
  const errorMessage = document.getElementById('error-message');

  loginForm.addEventListener('submit', async e => {
    e.preventDefault();

    const username = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
      await auth.login(username, password);
      window.location.href = 'index.html';
    } catch (err) {
      error.show(err.error || '登入失敗');
    }
  });
});
