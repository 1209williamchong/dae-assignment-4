export interface Software {
  name: string;
  description: string;
  categories: string[];
  version: string;
  lastUpdated: string;
  stars: number;
  forks: number;
  issues: number;
  license: string;
  language: string;
  url: string;
}

export const softwareData: Software[] = [
  {
    name: "Visual Studio Code",
    description: "一個輕量級但功能強大的源代碼編輯器",
    categories: ["編輯器", "開發工具"],
    version: "1.85.0",
    lastUpdated: "2024-01-15",
    stars: 150000,
    forks: 25000,
    issues: 5000,
    license: "MIT",
    language: "TypeScript",
    url: "https://github.com/microsoft/vscode"
  },
  {
    name: "Git",
    description: "分散式版本控制系統",
    categories: ["版本控制", "開發工具"],
    version: "2.42.0",
    lastUpdated: "2024-01-10",
    stars: 50000,
    forks: 15000,
    issues: 2000,
    license: "GPL-2.0",
    language: "C",
    url: "https://github.com/git/git"
  },
  {
    name: "Node.js",
    description: "JavaScript 運行時環境",
    categories: ["運行時", "開發工具"],
    version: "20.11.0",
    lastUpdated: "2024-01-05",
    stars: 100000,
    forks: 30000,
    issues: 4000,
    license: "MIT",
    language: "JavaScript",
    url: "https://github.com/nodejs/node"
  },
  {
    name: "React",
    description: "用於構建用戶界面的 JavaScript 庫",
    categories: ["前端框架", "開發工具"],
    version: "18.2.0",
    lastUpdated: "2024-01-20",
    stars: 200000,
    forks: 40000,
    issues: 6000,
    license: "MIT",
    language: "JavaScript",
    url: "https://github.com/facebook/react"
  },
  {
    name: "Docker",
    description: "容器化平台",
    categories: ["容器", "開發工具"],
    version: "24.0.0",
    lastUpdated: "2024-01-18",
    stars: 70000,
    forks: 20000,
    issues: 3000,
    license: "Apache-2.0",
    language: "Go",
    url: "https://github.com/docker/docker"
  }
];
