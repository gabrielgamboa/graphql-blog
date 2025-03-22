export type SearchParamsInput<T, K extends keyof T> = {
  page?: number;
  perPage?: number;
  filter?: string;
  sortBy?: K;
  sort?: 'asc' | 'desc';
};
