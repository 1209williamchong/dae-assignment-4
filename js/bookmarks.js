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
    const bookmarksList = document.getElementById('bookmarksList');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const listViewBtn = document.getElementById('listViewBtn');
    const gridViewBtn = document.getElementById('gridViewBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const noBookmarksMessage = document.getElementById('noBookmarksMessage');
    const noResultsMessage = document.getElementById('noResultsMessage');

    // 顯示加載指示器
    loadingIndicator.style.display = 'flex';
    noBookmarksMessage.style.display = 'none';
    noResultsMessage.style.display = 'none';

    // 模擬 API 請求延遲
    setTimeout(() => {
        displayBookmarks();
        loadingIndicator.style.display = 'none';
    }, 1000);

    // 搜索功能
    searchInput.addEventListener('input', () => {
        filterBookmarks();
    });

    // 類別過濾
    categoryFilter.addEventListener('change', () => {
        filterBookmarks();
    });

    // 視圖切換
    listViewBtn.addEventListener('click', () => {
        bookmarksList.classList.remove('grid-view');
        bookmarksList.classList.add('list-view');
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    });

    gridViewBtn.addEventListener('click', () => {
        bookmarksList.classList.remove('list-view');
        bookmarksList.classList.add('grid-view');
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    });

    // 登出功能
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('userEmail');
        window.location.href = 'login.html';
    });
};

// 過濾收藏
const filterBookmarks = () => {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const noBookmarksMessage = document.getElementById('noBookmarksMessage');
    const noResultsMessage = document.getElementById('noResultsMessage');

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let filteredData = softwareData.filter(software => favorites.includes(software.id.toString()));

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

    // 顯示結果
    displayBookmarks(filteredData);

    // 顯示消息
    if (favorites.length === 0) {
        noBookmarksMessage.style.display = 'block';
        noResultsMessage.style.display = 'none';
    } else if (filteredData.length === 0) {
        noBookmarksMessage.style.display = 'none';
        noResultsMessage.style.display = 'block';
    } else {
        noBookmarksMessage.style.display = 'none';
        noResultsMessage.style.display = 'none';
    }
};

// 顯示收藏列表
const displayBookmarks = (filteredData = null) => {
    const container = document.getElementById('bookmarksList');
    container.innerHTML = '';

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const dataToDisplay = filteredData || softwareData.filter(software => 
        favorites.includes(software.id.toString())
    );

    dataToDisplay.forEach(software => {
        const card = document.createElement('div');
        card.className = 'software-card';
        card.innerHTML = `
            <img src="${software.icon}" alt="${software.name}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
            <div class="category-tag">${software.category}</div>
            <button class="favorite-btn active" data-id="${software.id}">
                <i class="fas fa-star"></i>
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
    
    if (index !== -1) {
        favorites.splice(index, 1);
        button.classList.remove('active');
        button.innerHTML = '<i class="far fa-star"></i>';
        
        // 如果是從收藏頁面移除，重新過濾顯示
        if (window.location.pathname.includes('bookmarks.html')) {
            filterBookmarks();
        }
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
};

// 初始化頁面
document.addEventListener('DOMContentLoaded', init); 