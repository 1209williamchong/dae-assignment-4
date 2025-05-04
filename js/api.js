const API_BASE_URL = 'https://dae-mobile-assignment.hkit.cc/api';

// 用戶認證相關
export const auth = {
    // 註冊
    signup: async (username, password) => {
        const data = await fetchWithErrorHandling(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.user_id);
        }
        
        return data;
    },

    // 登入
    login: async (username, password) => {
        const data = await fetchWithErrorHandling(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.user_id);
        }
        
        return data;
    },

    // 檢查認證狀態
    check: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            return { user_id: null };
        }

        try {
            const data = await fetchWithErrorHandling(`${API_BASE_URL}/auth/check`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!data.user_id) {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
            }
            
            return data;
        } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            return { user_id: null };
        }
    },

    // 登出
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
    }
};

// 構建查詢參數
const buildQueryParams = (params) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.order) queryParams.append('order', params.order);
    
    return queryParams.toString();
};

// 軟體相關
export const software = {
    // 獲取所有軟體（帶分頁）
    getAll: async (params = {}) => {
        const queryString = buildQueryParams({
            page: params.page || 1,
            limit: params.limit || 3,
            ...params
        });

        return await fetchWithErrorHandling(`${API_BASE_URL}/software?${queryString}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    },

    // 搜索軟體
    search: async (query, params = {}) => {
        const queryString = buildQueryParams({
            search: query,
            page: params.page || 1,
            limit: params.limit || 3,
            ...params
        });

        return await fetchWithErrorHandling(`${API_BASE_URL}/software?${queryString}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    },

    // 按類別過濾
    filterByCategory: async (category, params = {}) => {
        const queryString = buildQueryParams({
            category,
            page: params.page || 1,
            limit: params.limit || 3,
            ...params
        });

        return await fetchWithErrorHandling(`${API_BASE_URL}/software?${queryString}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }
};

// 收藏相關
export const favorites = {
    // 獲取收藏列表
    getAll: async () => {
        const data = await fetchWithErrorHandling(`${API_BASE_URL}/bookmarks`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return data.item_ids || [];
    },

    // 添加收藏
    add: async (itemId) => {
        const data = await fetchWithErrorHandling(`${API_BASE_URL}/bookmarks/${itemId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return data.message === 'newly bookmarked';
    },

    // 移除收藏
    remove: async (itemId) => {
        const data = await fetchWithErrorHandling(`${API_BASE_URL}/bookmarks/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return data.message === 'newly deleted';
    }
};

// 錯誤處理
export const handleError = (error) => {
    if (error.response) {
        // 服務器返回錯誤
        const status = error.response.status;
        const errorMessage = error.response.data?.error || '發生錯誤，請稍後再試';
        
        let message;
        switch (status) {
            case 400:
                message = `無效的請求: ${errorMessage}`;
                break;
            case 401:
                message = '未授權，請重新登入';
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                break;
            case 403:
                message = '禁止訪問此資源';
                break;
            case 404:
                message = '找不到請求的資源';
                break;
            case 500:
                message = '伺服器發生錯誤，請稍後再試';
                break;
            default:
                message = errorMessage;
        }
        
        console.error(`API 錯誤 (${status}):`, errorMessage);
        return {
            success: false,
            status,
            message
        };
    } else if (error.request) {
        // 請求發送但沒有收到回應
        console.error('網絡錯誤:', error.request);
        return {
            success: false,
            status: 0,
            message: '網絡錯誤，請檢查您的網絡連接'
        };
    } else {
        // 其他錯誤
        console.error('錯誤:', error.message);
        return {
            success: false,
            status: -1,
            message: '發生未知錯誤，請稍後再試'
        };
    }
};

// 封裝 fetch 請求
const fetchWithErrorHandling = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        
        if (!response.ok) {
            throw {
                response: {
                    status: response.status,
                    data
                }
            };
        }
        
        return data;
    } catch (error) {
        throw handleError(error);
    }
};

// API 調用示範
export const demo = {
    // 示範調用需要身份驗證的 API
    getBookmarks: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw {
                    success: false,
                    status: 401,
                    message: '未登入，請先登入'
                };
            }

            const response = await fetch(`${API_BASE_URL}/bookmarks`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw {
                    response: {
                        status: response.status,
                        data: await response.json()
                    }
                };
            }

            const data = await response.json();
            console.log('收藏列表:', data.item_ids);
            return data.item_ids;
        } catch (error) {
            const handledError = handleError(error);
            console.error('獲取收藏列表失敗:', handledError.message);
            throw handledError;
        }
    },

    // 示範添加收藏
    addBookmark: async (itemId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw {
                    success: false,
                    status: 401,
                    message: '未登入，請先登入'
                };
            }

            const response = await fetch(`${API_BASE_URL}/bookmarks/${itemId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw {
                    response: {
                        status: response.status,
                        data: await response.json()
                    }
                };
            }

            const data = await response.json();
            console.log('添加收藏結果:', data.message);
            return data.message === 'newly bookmarked';
        } catch (error) {
            const handledError = handleError(error);
            console.error('添加收藏失敗:', handledError.message);
            throw handledError;
        }
    },

    // 示範移除收藏
    removeBookmark: async (itemId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw {
                    success: false,
                    status: 401,
                    message: '未登入，請先登入'
                };
            }

            const response = await fetch(`${API_BASE_URL}/bookmarks/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw {
                    response: {
                        status: response.status,
                        data: await response.json()
                    }
                };
            }

            const data = await response.json();
            console.log('移除收藏結果:', data.message);
            return data.message === 'newly deleted';
        } catch (error) {
            const handledError = handleError(error);
            console.error('移除收藏失敗:', handledError.message);
            throw handledError;
        }
    }
}; 