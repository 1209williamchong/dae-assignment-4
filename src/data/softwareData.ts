export interface Software {
  name: string;
  version: string;
  license: string;
  category: string;
  icon: string;
  video: string;
  description: string;
  tags: string[];
  date: string;
}

export const softwareData: Software[] = [
  {
    name: 'Mozilla Firefox',
    version: '125.0.1',
    license: 'Mozilla Public License 2.0',
    category: '網頁瀏覽器',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Firefox_logo%2C_2019.svg/120px-Firefox_logo%2C_2019.svg.png',
    video: 'https://www.youtube.com/embed/lmeDvSgN6zY?si=xlXxFoMH45yjawIL',
    description: 'Mozilla Firefox 是一款快速、安全的開源網頁瀏覽器，支持眾多擴充功能。',
    tags: ['瀏覽器', '網頁', '開源'],
    date: '2025-04-01',
  },
  {
    name: 'Linux (Ubuntu)',
    version: '24.04 LTS',
    license: 'GNU General Public License (GPL)',
    category: '作業系統',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Ubuntu-logo-2022.svg/250px-Ubuntu-logo-2022.svg.png',
    video: 'https://www.youtube.com/embed/lmeDvSgN6zY?si=TONUdRZXqLeqDw9R',
    description: 'Ubuntu 是基於 Linux 的開源作業系統，適合桌面和伺服器使用。',
    tags: ['Linux', '作業系統', '開源'],
    date: '2025-04-15',
  },
  {
    name: 'LibreOffice',
    version: '24.2.3',
    license: 'Mozilla Public License v2.0',
    category: '辦公室軟體',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/LibreOffice_Logo_Flat.svg/120px-LibreOffice_Logo_Flat.svg.png',
    video: 'https://www.youtube.com/embed/4RiUYjIZEug?si=jcAn2tBqoVu0uRT4',
    description: 'LibreOffice 是一套免費的開源辦公軟體，包含文書、試算表等工具。',
    tags: ['辦公室', '文書處理', '開源'],
    date: '2025-03-10',
  },
  {
    name: 'GIMP',
    version: '2.10.36',
    license: 'GNU General Public License v3.0',
    category: '圖像編輯器',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/The_GIMP_icon_-_v3.0.svg/120px-The_GIMP_icon_-_v3.0.svg.png',
    video: 'https://www.youtube.com/embed/LX-S1CX1HUI?si=MWupQoM7QZ-1E8R9',
    description: 'GIMP 是一款功能強大的開源圖像編輯軟體，類似 Photoshop。',
    tags: ['圖像編輯', '設計', '開源'],
    date: '2025-02-20',
  },
  {
    name: 'Git',
    version: '2.45.0',
    license: 'GNU General Public License v2.0',
    category: '版本控制',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Git-logo.svg/800px-Git-logo.svg.png',
    video: 'https://www.youtube.com/embed/8JJ101D3knE?si=iL64PAW-U6eI-Rs1',
    description: 'Git 是一款分散式版本控制系統，廣泛用於程式碼管理。',
    tags: ['版本控制', '程式設計', '開源'],
    date: '2025-04-05',
  },
];
