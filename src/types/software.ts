export interface Software {
  id: string;
  name: string;
  description: string;
  category: string;
  license: string;
  version: string;
  author: string;
  repository: string;
  website: string;
  stars: number;
  forks: number;
  downloads: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  dependencies: string[];
  screenshots: string[];
  documentation: string;
  isOpenSource: boolean;
  isVerified: boolean;
  isBookmarked: boolean;
  icon?: string;
  video?: string;
}

export interface SoftwareListResponse {
  items: Software[];
  hasMore: boolean;
  total: number;
}

export interface SoftwareSearchParams {
  page?: number;
  limit?: number;
  query?: string;
  category?: string;
  license?: string;
  minStars?: number;
  minDownloads?: number;
  isOpenSource?: boolean;
  isVerified?: boolean;
  sortBy?: 'stars' | 'downloads' | 'updated' | 'created';
  sortOrder?: 'asc' | 'desc';
}
