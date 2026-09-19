/**
 * Digital Observatory — Domain Models & Type Definitions
 */

export interface Source {
  label: string;
  url: string;
  note?: string;
}

export interface Heading {
  id: string;
  text: string;
  depth: number;
}

export interface Post {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  status: "draft" | "published";
  category: string;
  tags: string[];
  author: string;
  authorRole: string;
  featured: boolean;
  coverImage?: string;
  coverAlt?: string;
  keywords: string[];
  canonicalUrl?: string;
  noIndex: boolean;
  sources: Source[];
  readingTime: string;
  wordCount: number;
  content: string;
  headings: Heading[];
}

export interface PostFilterOptions {
  includeDrafts?: boolean;
  includeNoIndex?: boolean;
}

export interface SearchResult {
  slug: string;
  title: string;
  description: string;
  category: string;
  author: string;
  tags: string[];
  publishedAt: string;
  readingTime: string;
  wordCount: number;
  coverImage?: string;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface TaxonomyCount {
  name: string;
  slug: string;
  count: number;
}

export interface PaginationOptions {
  currentPage: number;
  totalPages: number;
  basePath: string;
}
