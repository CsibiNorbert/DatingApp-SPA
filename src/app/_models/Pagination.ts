export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

// generic because we don`t use it only for our users
export class PaginatedResult<T> {
  result: T; // store our users/messages
  pagination: Pagination;
}
