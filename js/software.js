import { softwareData } from './data.js';

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
const init = () => {
    if (!checkAuth()) return;

    // 獲取 DOM 元素
    const softwareList = document.getElementById('softwareList');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortBy = document.getElementById('sortBy');
    const sortDirection = document.getElementById('sortDirection');
    const listViewBtn = document.getElementById('listViewBtn');
    const gridViewBtn = document.getElementById('gridViewBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const noResultsMessage = document.getElementById('noResultsMessage');

    // 顯示加載指示器
    loadingIndicator.style.display = 'flex';
    noResultsMessage.style.display = 'none';

    // 模擬 API 請求延遲
    setTimeout(() => {
        displaySoftware(softwareData);
        loadingIndicator.style.display = 'none';
    }, 1000);

    // 搜索功能
    searchInput.addEventListener('input', () => {
        filterSoftware();
    });

    // 類別過濾
    categoryFilter.addEventListener('change', () => {
        filterSoftware();
    });

    // 排序功能
    sortBy.addEventListener('change', () => {
        filterSoftware();
    });

    sortDirection.addEventListener('click', () => {
        sortDirection.textContent = sortDirection.textContent === '升冪' ? '降冪' : '升冪';
        filterSoftware();
    });

    // 視圖切換
    listViewBtn.addEventListener('click', () => {
        softwareList.classList.remove('grid-view');
        softwareList.classList.add('list-view');
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    });

    gridViewBtn.addEventListener('click', () => {
        softwareList.classList.remove('list-view');
        softwareList.classList.add('grid-view');
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    });

    // 登出功能
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('userEmail');
        window.location.href = 'login.html';
    });
};

// 過濾和排序軟體
const filterSoftware = () => {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortBy = document.getElementById('sortBy');
    const sortDirection = document.getElementById('sortDirection');
    const noResultsMessage = document.getElementById('noResultsMessage');

    let filteredData = [...softwareData];

    // 搜索過濾
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        filteredData = filteredData.filter(software => 
            software.name.toLowerCase().includes(searchTerm) ||
            software.description.toLowerCase().includes(searchTerm) ||
            software.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }

    // 類別過濾
    const selectedCategory = categoryFilter.value;
    if (selectedCategory) {
        filteredData = filteredData.filter(software => 
            software.category === selectedCategory
        );
    }

    // 排序
    const sortField = sortBy.value;
    const isAscending = sortDirection.textContent === '升冪';
    
    filteredData.sort((a, b) => {
        let comparison = 0;
        if (sortField === 'name') {
            comparison = a.name.localeCompare(b.name);
        } else if (sortField === 'version') {
            comparison = a.version.localeCompare(b.version);
        } else if (sortField === 'date') {
            comparison = new Date(a.date) - new Date(b.date);
        }
        return isAscending ? comparison : -comparison;
    });

    // 顯示結果
    displaySoftware(filteredData);

    // 顯示無結果消息
    noResultsMessage.style.display = filteredData.length === 0 ? 'block' : 'none';
};

// 顯示軟體列表
const displaySoftware = (softwareList) => {
    const container = document.getElementById('softwareList');
    container.innerHTML = '';

    softwareList.forEach(software => {
        const card = document.createElement('div');
        card.className = 'software-card';
        card.innerHTML = `
            <img src="${software.icon}" alt="${software.name}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
            <div class="category-tag">${software.category}</div>
            <button class="favorite-btn" data-id="${software.id}">
                <i class="far fa-star"></i>
            </button>
            <div class="content">
                <h3>${software.name}</h3>
                <p>${software.description}</p>
                <div class="tags">
                    ${software.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="details">
                    <span>版本: ${software.version}</span>
                    <span>授權: ${software.license}</span>
                    <span class="date">更新日期: ${software.date}</span>
                </div>
                <div class="metrics">
                    <span><i class="fas fa-star"></i> ${software.stars.toLocaleString()}</span>
                    <span><i class="fas fa-code-branch"></i> ${software.forks.toLocaleString()}</span>
                    <span><i class="fas fa-download"></i> ${software.downloads.toLocaleString()}</span>
                </div>
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
};

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