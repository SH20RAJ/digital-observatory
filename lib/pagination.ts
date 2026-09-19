/**
 * Standard page size for article listings and archive indexes.
 */
export const PAGE_SIZE = 12;

/**
 * Calculates the total number of pages needed for a given collection length.
 * Always returns at least 1 page.
 */
export function getPageCount(totalItems: number, pageSize: number = PAGE_SIZE): number {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

/**
 * Slices an array of items for the requested 1-based page number.
 */
export function getPageItems<T>(items: T[], page: number, pageSize: number = PAGE_SIZE): T[] {
  const safePage = Math.max(1, Math.floor(page));
  const start = (safePage - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

/**
 * Generates an array of all valid 1-based page numbers [1, 2, ..., N].
 */
export function getPageNumbers(totalItems: number, pageSize: number = PAGE_SIZE): number[] {
  const count = getPageCount(totalItems, pageSize);
  return Array.from({ length: count }, (_, index) => index + 1);
}

/**
 * Computes a pagination sliding window with ellipsis for complex pagination bars.
 */
export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  delta: number = 2
): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const range: number[] = [];
  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(totalPages - 1, currentPage + delta);
    i++
  ) {
    range.push(i);
  }

  const result: (number | "...")[] = [1];
  if (range[0] > 2) {
    result.push("...");
  }
  result.push(...range);
  if (range[range.length - 1] < totalPages - 1) {
    result.push("...");
  }
  result.push(totalPages);

  return result;
}
