import { OrderEnum } from '../enums/order.enum';

export type PageInfo = {
  page: number;
  pageSize: number;
  pageCount: number;
  count: number;
};

export type BaseResponse<T> = {
  status: number;
  message: string;
  data: T;
};

export type BasePaginationResponse<T> = {
  status: number;
  message: string;
  data: T[];
  pageInfo: PageInfo;
};

export type BaseData = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
};

export type BaseQuery = PaginationQuery & {
  sorts?: SortQuery[];
};

export type PaginationQuery = {
  page?: number;
  limit?: number;
};

export type SortQuery = {
  field: string;
  order: OrderEnum;
};
