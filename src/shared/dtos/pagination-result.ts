export type PaginationResult<T> = {
  items: T[];
  currentPage: number;
  perPage: number;
  lastPage: number;
  total: number;
};
