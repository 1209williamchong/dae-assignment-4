import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const port = 3000;

// 啟用 CORS
app.use(cors());

// 解析 JSON 請求
app.use(express.json());

// 設置靜態文件目錄
app.use(express.static('./'));

// 模擬資料庫
let users = [];
let bookmarks = new Map(); // 使用 Map 來存儲用戶的書籤

// JWT 密鑰
const JWT_SECRET = 'your-secret-key';

// 資料驗證中間件
const validateUserInput = (req, res, next) => {
  const { username, email, password } = req.body;

  // 驗證用戶名
  if (!username || username.length < 3 || username.length > 20) {
    return res.status(400).json({ error: '用戶名長度必須在3-20個字符之間' });
  }

  // 驗證電子郵件格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: '請輸入有效的電子郵件地址' });
  }

  // 驗證密碼強度
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  if (!password || !passwordRegex.test(password)) {
    return res.status(400).json({
      error: '密碼必須包含至少8個字符，包括大寫字母、小寫字母和數字',
    });
  }

  next();
};

// 驗證登入輸入
const validateLoginInput = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: '請提供用戶名和密碼' });
  }

  next();
};

// 驗證軟體搜尋參數
const validateSearchParams = (req, res, next) => {
  const { page, limit, search, category, sort, order } = req.query;

  // 驗證頁碼
  if (page && (isNaN(page) || parseInt(page) < 1)) {
    return res.status(400).json({ error: '頁碼必須是正整數' });
  }

  // 驗證每頁數量
  if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
    return res.status(400).json({ error: '每頁數量必須在1-100之間' });
  }

  // 驗證搜尋關鍵字長度
  if (search && search.length > 100) {
    return res.status(400).json({ error: '搜尋關鍵字太長' });
  }

  // 驗證排序參數
  const validSortFields = ['title', 'version', 'date', 'category'];
  if (sort && !validSortFields.includes(sort)) {
    return res.status(400).json({ error: '無效的排序欄位' });
  }

  // 驗證排序方向
  if (order && !['asc', 'desc'].includes(order)) {
    return res.status(400).json({ error: '排序方向必須是 asc 或 desc' });
  }

  next();
};

// 驗證 JWT 中間件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '未授權' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '無效的令牌' });
    }
    req.user = user;
    next();
  });
};

// 軟體資料
const softwareData = [
  {
    id: 1,
    title: 'Mozilla Firefox',
    version: '125.0.1',
    license: 'Mozilla Public License 2.0',
    category: '網頁瀏覽器',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Firefox_logo%2C_2019.svg/120px-Firefox_logo%2C_2019.svg.png',
    video: 'https://www.youtube.com/embed/lmeDvSgN6zY?si=xlXxFoMH45yjawIL',
    description: 'Mozilla Firefox 是一款快速、安全的開源網頁瀏覽器，支持眾多擴充功能。',
    tags: ['瀏覽器', '網頁', '開源'],
    date: '2025-04-01',
  },
  {
    id: 2,
    title: 'Linux (Ubuntu)',
    version: '24.04 LTS',
    license: 'GNU General Public License (GPL)',
    category: '作業系統',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Ubuntu-logo-2022.svg/250px-Ubuntu-logo-2022.svg.png',
    video: 'https://www.youtube.com/embed/lmeDvSgN6zY?si=TONUdRZXqLeqDw9R',
    description: 'Ubuntu 是基於 Linux 的開源作業系統，適合桌面和伺服器使用。',
    tags: ['Linux', '作業系統', '開源'],
    date: '2025-04-15',
  },
  {
    id: 3,
    title: 'LibreOffice',
    version: '24.2.3',
    license: 'Mozilla Public License v2.0',
    category: '辦公室軟體',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/LibreOffice_Logo_Flat.svg/120px-LibreOffice_Logo_Flat.svg.png',
    video: 'https://www.youtube.com/embed/4RiUYjIZEug?si=jcAn2tBqoVu0uRT4',
    description: 'LibreOffice 是一套免費的開源辦公軟體，包含文書、試算表等工具。',
    tags: ['辦公室', '文書處理', '開源'],
    date: '2025-03-10',
  },
  {
    id: 4,
    title: 'GIMP',
    version: '2.10.36',
    license: 'GNU General Public License v3.0',
    category: '圖像編輯器',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/The_GIMP_icon_-_v3.0.svg/120px-The_GIMP_icon_-_v3.0.svg.png',
    video: 'https://www.youtube.com/embed/LX-S1CX1HUI?si=MWupQoM7QZ-1E8R9',
    description: 'GIMP 是一款功能強大的開源圖像編輯軟體，類似 Photoshop。',
    tags: ['圖像編輯', '設計', '開源'],
    date: '2025-02-20',
  },
  {
    id: 5,
    title: 'Git',
    version: '2.45.0',
    license: 'GNU General Public License v2.0',
    category: '版本控制',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Git-logo.svg/800px-Git-logo.svg.png',
    video: 'https://www.youtube.com/embed/8JJ101D3knE?si=iL64PAW-U6eI-Rs1',
    description: 'Git 是一款分散式版本控制系統，廣泛用於程式碼管理。',
    tags: ['版本控制', '程式設計', '開源'],
    date: '2025-04-05',
  },
  {
    id: 6,
    title: 'Visual Studio Code',
    version: '1.88.0',
    license: 'MIT License',
    category: '程式設計工具',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/800px-Visual_Studio_Code_1.35_icon.svg.png',
    video: 'https://www.youtube.com/embed/KMxo3T_MTvY',
    description: 'VS Code 是一款輕量、強大的開源程式碼編輯器。',
    tags: ['編輯器', '程式設計', '開源'],
    date: '2025-03-15',
  },
  {
    id: 7,
    title: 'MySQL',
    version: '8.4.0',
    license: 'GNU General Public License v2.0',
    category: '資料庫',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/zh/thumb/6/62/MySQL.svg/136px-MySQL.svg.png',
    video: 'https://www.youtube.com/embed/OM4aZJW_Ojs',
    description: 'MySQL 是一款高效的開源關聯式資料庫管理系統。',
    tags: ['資料庫', '後端', '開源'],
    date: '2025-01-10',
  },
  {
    id: 8,
    title: 'VLC Media Player',
    version: '3.0.21',
    license: 'GNU General Public License v2.0',
    category: '媒體播放器',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/VLC_Icon.svg/120px-VLC_Icon.svg.png',
    video: 'https://www.youtube.com/embed/sRn7WAGFlyg?si=XVCOtEq7bLXF6Chm',
    description: 'VLC 是一款支援多格式的開源媒體播放器。',
    tags: ['媒體', '播放器', '開源'],
    date: '2025-02-15',
  },
  {
    id: 9,
    title: 'Inkscape',
    version: '1.4.0',
    license: 'GNU General Public License v3.0',
    category: '圖像編輯器',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Inkscape_Logo.svg/120px-Inkscape_Logo.svg.png',
    video: 'https://www.youtube.com/embed/pa6a7oz7vEE',
    description: 'Inkscape 是一款用於向量圖形的開源編輯工具。',
    tags: ['向量圖形', '設計', '開源'],
    date: '2025-03-01',
  },
  {
    id: 10,
    title: 'Apache HTTP Server',
    version: '2.4.62',
    license: 'Apache License 2.0',
    category: '網頁伺服器',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Apache_HTTP_server_logo_%282016%29.png/250px-Apache_HTTP_server_logo_%282016%29.png',
    video: 'https://www.youtube.com/embed/1CDxpAzvLKY?si',
    description: 'Apache 是全球廣泛使用的開源網頁伺服器軟體。',
    tags: ['伺服器', '網頁', '開源'],
    date: '2025-04-10',
  },
  {
    id: 11,
    title: 'Eclipse',
    version: '4.31.0',
    license: 'Eclipse Public License 2.0',
    category: '程式設計工具',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Eclipse-Luna-Logo.svg/250px-Eclipse-Luna-Logo.svg.png',
    video: 'https://www.youtube.com/embed/RJPL8oSYWGo?si=DUXoIvGkEo9VPdcd',
    description: 'Eclipse 是一款開源的整合開發環境，適合 Java 開發。',
    tags: ['IDE', '程式設計', '開源'],
    date: '2025-02-10',
  },
  {
    id: 12,
    title: 'PostgreSQL',
    version: '17.0',
    license: 'PostgreSQL License',
    category: '資料庫',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Pg_logo.png/120px-Pg_logo.png',
    video: 'https://www.youtube.com/embed/SpfIwlAYaKk?si=Gp5DHDu4pKmStoDO',
    description: 'PostgreSQL 是一款強大的開源物件關聯式資料庫。',
    tags: ['資料庫', '後端', '開源'],
    date: '2025-03-20',
  },
  {
    id: 13,
    title: '7-Zip',
    version: '24.03',
    license: 'GNU Lesser General Public License',
    category: '檔案管理',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/7ziplogo.svg/120px-7ziplogo.svg.png',
    video: 'https://www.youtube.com/embed/AR15eWlJG6I?si=j-hDVOc5ECGtcf8w',
    description: '7-Zip 是一款高效的開源檔案壓縮工具。',
    tags: ['壓縮', '檔案', '開源'],
    date: '2025-01-15',
  },
  {
    id: 14,
    title: 'Chromium',
    version: '124.0.6367.0',
    license: 'BSD License',
    category: '網頁瀏覽器',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Chromium_Logo.svg/120px-Chromium_Logo.svg.png',
    video: 'https://www.youtube.com/embed/oc85UCMI9tA?si=BIR7f0d7e7LYsXsM',
    description: 'Chromium 是 Chrome 的開源基礎，注重隱私和性能。',
    tags: ['瀏覽器', '網頁', '開源'],
    date: '2025-04-03',
  },
  {
    id: 15,
    title: 'Debian',
    version: '12.5',
    license: 'GNU General Public License',
    category: '作業系統',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Debian-OpenLogo.svg/80px-Debian-OpenLogo.svg.png',
    video: 'https://www.youtube.com/embed/zOZEkzwhThc?si=uWG2q32PgnaHllu3',
    description: 'Debian 是一款穩定、靈活的開源 Linux 發行版。',
    tags: ['Linux', '作業系統', '開源'],
    date: '2025-02-25',
  },
  {
    id: 16,
    title: 'Node.js',
    version: '22.0.0',
    license: 'MIT License',
    category: '程式設計工具',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/120px-Node.js_logo.svg.png',
    video: 'https://www.youtube.com/embed/TlB_eWDSMt4',
    description: 'Node.js 是基於 JavaScript 的開源伺服器執行環境。',
    tags: ['JavaScript', '後端', '開源'],
    date: '2025-04-12',
  },
  {
    id: 17,
    title: 'Audacity',
    version: '3.5.0',
    license: 'GNU General Public License v2.0',
    category: '媒體播放器',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Audacity_Logo_With_Name.png/253px-Audacity_Logo_With_Name.png',
    video: 'https://www.youtube.com/embed/yzJ2VyYkmaA?si=NbUHoZBKhUSO8gUp',
    description: 'Audacity 是一款開源的音訊編輯和錄製軟體。',
    tags: ['音訊', '編輯', '開源'],
    date: '2025-03-05',
  },
  {
    id: 18,
    title: 'FileZilla',
    version: '3.67.0',
    license: 'GNU General Public License v2.0',
    category: '檔案管理',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/FileZilla_logo.svg/120px-FileZilla_logo.svg.png',
    video: 'https://www.youtube.com/embed/adxmlHDim6c?si=8xmLQmo_JBfppwUJ',
    description: 'FileZilla 是一款開源的 FTP 檔案傳輸工具。',
    tags: ['FTP', '檔案', '開源'],
    date: '2025-02-05',
  },
  {
    id: 19,
    title: 'NGINX',
    version: '1.26.0',
    license: 'BSD License',
    category: '網頁伺服器',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Nginx_logo.svg/160px-Nginx_logo.svg.png',
    video: 'https://www.youtube.com/embed/9t9Mp0BGnyI?si=HBN2w57Eovc53HBa',
    description: 'NGINX 是一款高效的開源網頁伺服器和反向代理。',
    tags: ['伺服器', '網頁', '開源'],
    date: '2025-01-20',
  },
  {
    id: 20,
    title: 'Apache OpenOffice',
    version: '4.1.16',
    license: 'Apache License 2.0',
    category: '辦公室軟體',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Apache_OpenOffice_logo_and_wordmark_%282014%29.svg/250px-Apache_OpenOffice_logo_and_wordmark_%282014%29.svg.png',
    video: 'https://www.youtube.com/embed/oJnCEqeAsUk?si=DK4U65M-g08oD4Ji',
    description: 'Apache OpenOffice 是一套開源辦公軟體，支援多種文件格式。',
    tags: ['辦公室', '文書處理', '開源'],
    date: '2025-04-08',
  },
];

// 註冊 API
app.post('/api/register', validateUserInput, async (req, res) => {
  const { username, email, password } = req.body;

  // 檢查用戶名是否已存在
  if (users.some(u => u.username === username)) {
    return res.status(400).json({ error: '用戶名已存在' });
  }

  // 檢查電子郵件是否已存在
  if (users.some(u => u.email === email)) {
    return res.status(400).json({ error: '電子郵件已存在' });
  }

  // 創建新用戶
  const newUser = {
    id: users.length + 1,
    username,
    email,
    password,
  };

  users.push(newUser);
  res.status(201).json({ message: '註冊成功' });
});

// 登入 API
app.post('/api/login', validateLoginInput, async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ error: '用戶名或密碼錯誤' });
  }

  if (user.password !== password) {
    return res.status(401).json({ error: '用戶名或密碼錯誤' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
  res.json({ token });
});

// 獲取所有分類
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(softwareData.map(item => item.category))].filter(Boolean);
  res.json(categories);
});

// 獲取軟體列表
app.get('/api/software', validateSearchParams, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 3, 5); // 預設 3，最大 5
  const search = req.query.search?.toLowerCase() || '';
  const category = req.query.category || '';
  const sort = req.query.sort || 'title';
  const order = req.query.order || 'asc';
  const bookmarksOnly = req.query.bookmarksOnly === 'true';

  let filteredData = [...softwareData];

  // 搜尋過濾
  if (search) {
    filteredData = filteredData.filter(
      item =>
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        item.tags.some(tag => tag.toLowerCase().includes(search))
    );
  }

  // 分類過濾
  if (category) {
    filteredData = filteredData.filter(item => item.category === category);
  }

  // 只顯示收藏項目
  if (bookmarksOnly) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: '需要登入才能查看收藏項目' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userBookmarks = bookmarks.get(decoded.id) || [];
      const bookmarkIds = new Set(userBookmarks.map(b => b.id));
      filteredData = filteredData.filter(item => bookmarkIds.has(item.id));
    } catch (error) {
      return res.status(401).json({ error: '無效的登入狀態' });
    }
  }

  // 排序
  filteredData.sort((a, b) => {
    let aValue = a[sort];
    let bValue = b[sort];

    // 處理日期排序
    if (sort === 'date') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (order === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // 格式化回應數據
  const formattedData = paginatedData.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    imageUrl: item.imageUrl,
    videoUrl: item.video,
  }));

  res.json({
    items: formattedData,
    pagination: {
      page,
      limit,
      total: filteredData.length,
    },
  });
});

// 獲取特定軟體
app.get('/api/software/:id', (req, res) => {
  const software = softwareData.find(s => s.id === parseInt(req.params.id));
  if (software) {
    res.json(software);
  } else {
    res.status(404).json({ error: '找不到指定的軟體' });
  }
});

// 獲取收藏列表 API
app.get('/api/bookmarks', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const userBookmarks = bookmarks.get(userId) || [];
  const itemIds = userBookmarks.map(b => b.id);
  res.json({ item_ids: itemIds });
});

// 添加收藏 API
app.post('/api/bookmarks/:item_id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const itemId = parseInt(req.params.item_id);

  // 獲取用戶的收藏列表
  let userBookmarks = bookmarks.get(userId) || [];

  // 檢查是否已經收藏
  const isAlreadyBookmarked = userBookmarks.some(b => b.id === itemId);

  if (isAlreadyBookmarked) {
    return res.json({ message: 'already bookmarked' });
  }

  // 獲取軟體資訊
  const software = softwareData.find(s => s.id === itemId);
  if (!software) {
    return res.status(404).json({ error: '軟體不存在' });
  }

  // 添加收藏
  userBookmarks.push(software);
  bookmarks.set(userId, userBookmarks);

  res.json({ message: 'newly bookmarked' });
});

// 移除收藏 API
app.delete('/api/bookmarks/:item_id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const itemId = parseInt(req.params.item_id);

  let userBookmarks = bookmarks.get(userId) || [];
  const initialLength = userBookmarks.length;

  // 移除收藏
  userBookmarks = userBookmarks.filter(b => b.id !== itemId);
  bookmarks.set(userId, userBookmarks);

  if (userBookmarks.length === initialLength) {
    return res.json({ message: 'already deleted' });
  }

  res.json({ message: 'newly deleted' });
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`伺服器運行在 http://localhost:${port}`);
});
