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
  _id: number;
  createdAt: Date;
  updatedAt: Date;
};

export type PaginationQuery = {
  page?: number;
  limit?: number;
};

export type SortQuery = {
  field: string;
  order: OrderEnum;
};
