const API_BASE_URL = 'https://dae-mobile-assignment.hkit.cc/api';

// 錯誤處理函數
const handleError = (error) => {
    if (error.status === 400) return { error: '無效的請求' };
    if (error.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        return { error: '未授權，請重新登入' };
    }
    if (error.status === 403) return { error: '禁止訪問' };
    if (error.status === 404) return { error: '找不到資源' };
    if (error.status === 500) return { error: '伺服器錯誤' };
    return { error: error.message || '發生錯誤' };
};

// 封裝 fetch 請求
const fetchWithErrorHandling = async (url, options = {}) => {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(localStorage.getItem('token') && {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }),
                ...options.headers
            }
        });

        if (!response.ok) {
            throw { status: response.status, message: response.statusText };
        }

        return await response.json();
    } catch (error) {
        throw handleError(error);
    }
};

// 使用者認證相關 API
export const auth = {
    // 註冊
    signup: async (username, password) => {
        const response = await fetchWithErrorHandling(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        localStorage.setItem('token', response.token);
        localStorage.setItem('user_id', response.user_id);
        return response;
    },

    // 登入
    login: async (username, password) => {
        const response = await fetchWithErrorHandling(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        localStorage.setItem('token', response.token);
        localStorage.setItem('user_id', response.user_id);
        return response;
    },

    // 檢查登入狀態
    check: async () => {
        try {
            const response = await fetchWithErrorHandling(`${API_BASE_URL}/auth/check`);
            return response.user_id;
        } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('user_id');
            return null;
        }
    },

    // 登出
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
    }
};

// 軟體列表相關 API
export const software = {
    // 獲取所有軟體（支持分頁、搜索、分類、排序）
    getAll: async ({ page = 1, limit = 10, search = '', category = '', sort = 'name', order = 'asc' } = {}) => {
        const params = new URLSearchParams({
            page,
            limit,
            ...(search && { search }),
            ...(category && { category }),
            sort,
            order
        });
        return await fetchWithErrorHandling(`${API_BASE_URL}/software?${params}`);
    },

    // 獲取分類列表
    getCategories: async () => {
        return await fetchWithErrorHandling(`${API_BASE_URL}/software/categories`);
    },

    // 獲取單個軟體詳情
    getById: async (id) => {
        return await fetchWithErrorHandling(`${API_BASE_URL}/software/${id}`);
    },

    // 獲取軟體統計信息
    getStats: async () => {
        return await fetchWithErrorHandling(`${API_BASE_URL}/software/stats`);
    }
};

// 收藏相關 API
export const favorites = {
    // 獲取收藏列表
    getAll: async () => {
        return await fetchWithErrorHandling(`${API_BASE_URL}/bookmarks`);
    },

    // 添加收藏
    add: async (itemId) => {
        return await fetchWithErrorHandling(`${API_BASE_URL}/bookmarks/${itemId}`, {
            method: 'POST'
        });
    },

    // 移除收藏
    remove: async (itemId) => {
        return await fetchWithErrorHandling(`${API_BASE_URL}/bookmarks/${itemId}`, {
            method: 'DELETE'
        });
    }
};

// 載入狀態管理
export const loading = {
    show: () => {
        const loadingElement = document.createElement('div');
        loadingElement.className = 'loading';
        loadingElement.innerHTML = `
            <div class="spinner"></div>
            <p>載入中...</p>
        `;
        document.body.appendChild(loadingElement);
    },
    hide: () => {
        const loadingElement = document.querySelector('.loading');
        if (loadingElement) {
            loadingElement.remove();
        }
    }
};

// 錯誤提示管理
export const error = {
    show: (message) => {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        document.body.appendChild(errorElement);
        setTimeout(() => errorElement.remove(), 3000);
    }
}; 