import './styles.css';

// 定義介面
interface Software {
  id: string;
  name: string;
  description: string;
  category: string;
  license: string;
  url: string;
}

// 初始化應用
document.addEventListener('DOMContentLoaded', () => {
  console.log('應用已啟動');

  // 檢查用戶是否已登入
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // 更新導航欄顯示
  const nav = document.querySelector('nav');
  if (nav) {
    if (isLoggedIn) {
      nav.innerHTML = `
        <a href="bookmarks.html">我的書籤</a>
        <a href="software.html">軟體清單</a>
        <a href="#" id="logout">登出</a>
      `;
    } else {
      nav.innerHTML = `
        <a href="login.html">登入</a>
        <a href="register.html">註冊</a>
      `;
    }
  }

  // 處理登出
  const logoutButton = document.getElementById('logout');
  if (logoutButton) {
    logoutButton.addEventListener('click', e => {
      e.preventDefault();
      localStorage.removeItem('isLoggedIn');
      window.location.href = 'index.html';
    });
  }
});
