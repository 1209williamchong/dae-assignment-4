export interface Software {
  name: string;
  description: string;
  version: string;
  author: string;
  license: string;
  repository: string;
  stars: number;
  forks: number;
  issues: number;
  lastUpdated: string;
  categories: string[];
  isBookmarked: boolean;
}

export interface SoftwareListResponse {
  items: Software[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface SoftwareFilters {
  search: string;
  searchFields: string[];
  exactMatch: boolean;
  view: 'list' | 'grid';
  categories: string[];
  sortBy: string;
  sortDirection: boolean;
  startDate: string;
  endDate: string;
}
