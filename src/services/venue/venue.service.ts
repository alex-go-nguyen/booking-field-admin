import {
  SearchVenueQuery,
  SearchVenueResponse,
  UpdateVenuePayload,
  VenueQuery,
  VenueResponse,
  VenuesResponse,
} from './venue.dto';
import axiosInstance from '@/utils/axiosConfig';

export const getVenues = async (query: VenueQuery) => {
  const { location } = query;

  const { data } = await axiosInstance.get<VenuesResponse>('/venues', {
    params: {
      location,
    },
  });

  return data;
};

export const getVenue = async (slug: string) => {
  const { data } = await axiosInstance.get<VenueResponse>(`/venues/${slug}`);

  return data.data;
};

export const searchVenues = async (query: SearchVenueQuery) => {
  const { data } = await axiosInstance.get<SearchVenueResponse>('/venues/search', {
    params: {
      ...query,
    },
  });

  return data;
};

export const getVenueByUser = async (userId: number) => {
  const { data } = await axiosInstance.get<VenueResponse>(`/venues/user/${userId}`);

  return data.data;
};

export const updateVenue = async ({ id, data: updateVenueData }: UpdateVenuePayload) => {
  const { data } = await axiosInstance.put<VenueResponse>(`/venues/${id}`, updateVenueData);

  return data;
};
