export type PaginationResult<T> = {
  items: T[];
  total: number;
  currentPage: number;
  perPage: number;
  lastPage: number;
};
