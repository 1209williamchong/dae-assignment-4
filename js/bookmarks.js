import { softwareData } from './data.js';
import { favorites, loading, error } from './api.js';

let bookmarkedItems = new Set();

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

    await loadBookmarks();
    setupEventListeners();

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
                <i class="fas fa-heart${bookmarkedItems.has(software.id.toString()) ? '' : '-o'}"></i>
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
        btn.addEventListener('click', async () => {
            const softwareId = btn.dataset.id;
            try {
                if (bookmarkedItems.has(softwareId)) {
                    await favorites.remove(softwareId);
                    bookmarkedItems.delete(softwareId);
                } else {
                    await favorites.add(softwareId);
                    bookmarkedItems.add(softwareId);
                }
                updateBookmarkButton(btn);
            } catch (err) {
                error.show(err.error || '操作失敗');
            }
        });
    });
};

// 更新所有收藏按鈕狀態
function updateBookmarkButtons() {
    const buttons = document.querySelectorAll('.favorite-btn');
    buttons.forEach(button => {
        updateBookmarkButton(button);
    });
}

// 更新單個收藏按鈕狀態
function updateBookmarkButton(button) {
    const itemId = button.dataset.id;
    const isBookmarked = bookmarkedItems.has(itemId);
    
    button.innerHTML = `
        <i class="fas fa-heart${isBookmarked ? '' : '-o'}"></i>
    `;
    button.classList.toggle('active', isBookmarked);
}

// 檢查項目是否已收藏
export function isBookmarked(itemId) {
    return bookmarkedItems.has(itemId);
}

// 獲取收藏列表
export function getBookmarkedItems() {
    return Array.from(bookmarkedItems);
}

// 載入收藏列表
async function loadBookmarks() {
    try {
        loading.show();
        const data = await favorites.getAll();
        bookmarkedItems = new Set(data.item_ids);
        updateBookmarkButtons();
    } catch (err) {
        error.show(err.error || '載入收藏列表失敗');
    } finally {
        loading.hide();
    }
}

// 設置事件監聽器
function setupEventListeners() {
    // 收藏按鈕點擊事件
    document.addEventListener('click', async (e) => {
        if (e.target.closest('.favorite-btn')) {
            const button = e.target.closest('.favorite-btn');
            const itemId = button.dataset.id;
            
            try {
                if (bookmarkedItems.has(itemId)) {
                    await favorites.remove(itemId);
                    bookmarkedItems.delete(itemId);
                } else {
                    await favorites.add(itemId);
                    bookmarkedItems.add(itemId);
                }
                updateBookmarkButton(button);
            } catch (err) {
                error.show(err.error || '操作失敗');
            }
        }
    });

    // 只顯示收藏項目切換
    const showFavoritesOnly = document.getElementById('show-favorites-only');
    if (showFavoritesOnly) {
        showFavoritesOnly.addEventListener('change', (e) => {
            const cards = document.querySelectorAll('.software-card');
            cards.forEach(card => {
                const itemId = card.querySelector('.favorite-btn').dataset.id;
                card.style.display = e.target.checked && !bookmarkedItems.has(itemId) ? 'none' : 'block';
            });
        });
    }
}

// 初始化頁面
document.addEventListener('DOMContentLoaded', init); 