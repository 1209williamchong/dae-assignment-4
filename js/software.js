import { software, loading, error } from './api.js';

let currentPage = 1;
let isLoading = false;
let hasMore = true;
let currentCategory = '';
let currentSearch = '';
let currentSort = 'name';
let currentOrder = 'asc';

// 檢查用戶是否已登入
const checkAuth = () => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        window.location.href = 'login.html';
        return false;
    }
    document.getElementById('userEmail').textContent = userEmail;
    return true;
};

// 初始化頁面
const init = async () => {
    if (!checkAuth()) return;

    await loadSoftware();
    setupEventListeners();
};

// 設置事件監聽器
function setupEventListeners() {
    // 搜索功能
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', debounce(async (e) => {
        currentSearch = e.target.value;
        currentPage = 1;
        await loadSoftware();
    }, 500));

    // 分類過濾
    const categorySelect = document.getElementById('category-select');
    categorySelect.addEventListener('change', async (e) => {
        currentCategory = e.target.value;
        currentPage = 1;
        await loadSoftware();
    });

    // 排序功能
    const sortSelect = document.getElementById('sort-select');
    sortSelect.addEventListener('change', async (e) => {
        const [sort, order] = e.target.value.split('-');
        currentSort = sort;
        currentOrder = order;
        currentPage = 1;
        await loadSoftware();
    });

    // 無限滾動
    window.addEventListener('scroll', debounce(async () => {
        if (isLoading || !hasMore) return;
        
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            currentPage++;
            await loadSoftware(true);
        }
    }, 200));

    // 視圖切換
    const listViewBtn = document.getElementById('listViewBtn');
    const gridViewBtn = document.getElementById('gridViewBtn');
    listViewBtn.addEventListener('click', () => {
        document.getElementById('software-list').classList.remove('grid-view');
        document.getElementById('software-list').classList.add('list-view');
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    });

    gridViewBtn.addEventListener('click', () => {
        document.getElementById('software-list').classList.remove('list-view');
        document.getElementById('software-list').classList.add('grid-view');
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    });

    // 登出功能
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('userEmail');
        window.location.href = 'login.html';
    });
}

// 載入軟體列表
async function loadSoftware(append = false) {
    try {
        loading.show();
        isLoading = true;

        const data = await software.getAll({
            page: currentPage,
            search: currentSearch,
            category: currentCategory,
            sort: currentSort,
            order: currentOrder
        });

        if (!append) {
            document.getElementById('software-list').innerHTML = '';
        }

        if (data.items.length === 0) {
            hasMore = false;
            if (!append) {
                showNoResults();
            }
            return;
        }

        renderSoftwareList(data.items);
        hasMore = data.has_more;
    } catch (err) {
        error.show(err.error || '載入軟體列表失敗');
    } finally {
        loading.hide();
        isLoading = false;
    }
}

// 渲染軟體列表
function renderSoftwareList(items) {
    const container = document.getElementById('software-list');
    
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'software-card';
        card.innerHTML = `
            <div class="software-header">
                <img src="${item.icon}" alt="${item.name}" class="software-icon">
                <h3>${item.name}</h3>
            </div>
            <div class="software-details">
                <p class="version">版本: ${item.version}</p>
                <p class="license">授權: ${item.license}</p>
                <p class="category">類別: ${item.category}</p>
            </div>
            <div class="software-description">
                <p>${item.description}</p>
            </div>
            <div class="software-tags">
                ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="software-footer">
                <button class="favorite-btn" data-id="${item.id}">
                    <i class="fas fa-heart"></i>
                </button>
                <a href="${item.video}" target="_blank" class="video-link">
                    <i class="fas fa-video"></i> 觀看影片
                </a>
            </div>
        `;
        container.appendChild(card);
    });

    // 添加收藏按鈕事件監聽器
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const softwareId = btn.dataset.id;
            toggleFavorite(softwareId, btn);
        });
    });
}

// 顯示無結果提示
function showNoResults() {
    const container = document.getElementById('software-list');
    container.innerHTML = `
        <div class="no-results">
            <i class="fas fa-search"></i>
            <p>找不到符合條件的軟體</p>
        </div>
    `;
}

// 防抖函數
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 切換收藏狀態
const toggleFavorite = (softwareId, button) => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const index = favorites.indexOf(softwareId);
    
    if (index === -1) {
        favorites.push(softwareId);
        button.classList.add('active');
        button.innerHTML = '<i class="fas fa-star"></i>';
    } else {
        favorites.splice(index, 1);
        button.classList.remove('active');
        button.innerHTML = '<i class="far fa-star"></i>';
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
};

// 初始化頁面
document.addEventListener('DOMContentLoaded', init); 