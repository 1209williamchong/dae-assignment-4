// 模擬的軟體數據
const softwareData = [
  {
    name: 'Visual Studio Code',
    description: '一個輕量級但功能強大的源代碼編輯器',
    categories: ['編輯器', '開發工具'],
    version: '1.85.0',
    lastUpdated: '2024-01-15',
  },
  {
    name: 'Git',
    description: '分散式版本控制系統',
    categories: ['版本控制', '開發工具'],
    version: '2.42.0',
    lastUpdated: '2024-01-10',
  },
  {
    name: 'Node.js',
    description: 'JavaScript 運行時環境',
    categories: ['運行時', '開發工具'],
    version: '20.11.0',
    lastUpdated: '2024-01-05',
  },
];

// DOM 元素
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const softwareList = document.getElementById('softwareList');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const closeButtons = document.querySelectorAll('.close');

// 當前用戶狀態
let currentUser = null;
let bookmarks = new Set();

// 初始化頁面
function initializePage() {
  renderSoftwareList(softwareData);
  setupEventListeners();
  updateAuthButtons();
}

// 設置事件監聽器
function setupEventListeners() {
  searchInput.addEventListener('input', handleSearch);
  categoryFilter.addEventListener('change', handleCategoryFilter);
  loginBtn.addEventListener('click', () => showModal(loginModal));
  registerBtn.addEventListener('click', () => showModal(registerModal));
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      hideModal(loginModal);
      hideModal(registerModal);
    });
  });
}

// 渲染軟體列表
function renderSoftwareList(software) {
  softwareList.innerHTML = '';
  software.forEach(item => {
    const card = createSoftwareCard(item);
    softwareList.appendChild(card);
  });
}

// 創建軟體卡片
function createSoftwareCard(software) {
  const card = document.createElement('div');
  card.className = 'software-card';

  const isBookmarked = bookmarks.has(software.name);

  card.innerHTML = `
        <h2>${software.name}</h2>
        <p>${software.description}</p>
        <p>版本: ${software.version}</p>
        <p>最後更新: ${software.lastUpdated}</p>
        <div class="categories">
            ${software.categories.map(cat => `<span class="category">${cat}</span>`).join('')}
        </div>
        <div class="bookmark ${isBookmarked ? 'active' : ''}" 
             onclick="toggleBookmark('${software.name}')">
            <i class="fas fa-bookmark"></i>
        </div>
    `;

  return card;
}

// 處理搜索
function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredSoftware = softwareData.filter(
    software =>
      software.name.toLowerCase().includes(searchTerm) ||
      software.description.toLowerCase().includes(searchTerm)
  );
  renderSoftwareList(filteredSoftware);
}

// 處理類別過濾
function handleCategoryFilter() {
  const selectedCategory = categoryFilter.value;
  if (selectedCategory === 'all') {
    renderSoftwareList(softwareData);
  } else {
    const filteredSoftware = softwareData.filter(software =>
      software.categories.includes(selectedCategory)
    );
    renderSoftwareList(filteredSoftware);
  }
}

// 切換書籤
function toggleBookmark(softwareName) {
  if (bookmarks.has(softwareName)) {
    bookmarks.delete(softwareName);
  } else {
    bookmarks.add(softwareName);
  }
  renderSoftwareList(softwareData);
}

// 顯示模態框
function showModal(modal) {
  modal.style.display = 'block';
}

// 隱藏模態框
function hideModal(modal) {
  modal.style.display = 'none';
}

// 更新認證按鈕
function updateAuthButtons() {
  const authButtons = document.querySelector('.auth-buttons');
  if (currentUser) {
    authButtons.innerHTML = `
            <span>歡迎, ${currentUser}</span>
            <button onclick="logout()">登出</button>
        `;
  } else {
    authButtons.innerHTML = `
            <button id="loginBtn">登入</button>
            <button id="registerBtn">註冊</button>
        `;
  }
}

// 登出
function logout() {
  currentUser = null;
  updateAuthButtons();
}

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', initializePage);
