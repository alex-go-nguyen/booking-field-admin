import { Pitch } from '../pitch/pitch.dto';
import { Rating } from '../rating/rating.dto';
import { User } from '../user/user.dto';
import {
  BaseData,
  BasePaginationResponse,
  BaseQuery,
  BaseResponse,
  PaginationQuery,
  SortQuery,
} from '@/common/dtos/base.dto';

export type VenuesResponse = BasePaginationResponse<Venue>;
export type VenueResponse = BaseResponse<Venue>;
export type SearchVenueResponse = BasePaginationResponse<SearchVenueData>;

export type UpdateVenuePayload = {
  id: number;
  data: UpdateVenueData;
};

export type SearchVenueQuery = {
  pitchCategory: number;
  minPrice: number;
  maxPrice: number;
  location: string;
  sorts?: SortQuery[];
} & PaginationQuery;

export type UpdateVenueData = {
  name?: string;
  description?: string;
  address?: string;
  province?: string;
  district?: string;
  openAt?: string;
  closeAt?: string;
  imageList?: VenueImage[];
  location?: LocationMap;
};

export type Venue = {
  name: string;
  description: string;
  location: LocationMap;
  address: string;
  province: string;
  district: string;
  pitches: Pitch[];
  imageList: VenueImage[];
  ratings: Rating[];
  openAt: string;
  closeAt: string;
  slug: string;
  user: User;
  status: VenueStatusEnum;
} & BaseData;

export enum VenueStatusEnum {
  Active = 'active',
  Waiting = 'waiting',
  Cancel = 'cancel',
}

export type LocationMap = {
  lat: number;
  lng: number;
};

export type Price = {
  type: string;
  pricePerHour: number;
};

export type SearchVenueData = Venue & {
  price: number;
  averageRate: number;
  totalReview: number;
};

export type VenueImage = {
  imagePath: string;
};

export type VenueQuery = {
  userId?: number;
  status?: VenueStatusEnum;
  keyword?: string;
} & BaseQuery;

export type CreateVenueDto = {
  name: string;
  description: string;
  province: string;
  district: string;
  address: string;
  openAt: string;
  closeAt: string;
  user: number;
};
