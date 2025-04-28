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

export interface SoftwareFilters {
  search: string;
  searchFields: string[];
  exactMatch: boolean;
  view: 'list' | 'grid';
  categories: string[];
  sortBy: 'name' | 'version';
  sortDirection: boolean;
  startDate: string;
  endDate: string;
  activeCategoryTags: string[];
  activeTags: string[];
}

export interface SoftwareListResponse {
  items: Software[];
  nextPage: number | null;
}
