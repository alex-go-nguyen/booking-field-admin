import {
  CreateVenueDto,
  SearchVenueQuery,
  SearchVenueResponse,
  UpdateVenuePayload,
  VenueQuery,
  VenueResponse,
  VenuesResponse,
} from './venue.dto';
import axiosInstance from '@/utils/axiosConfig';

const venueService = {
  getAll: async (query: VenueQuery) => {
    const { data } = await axiosInstance.get<VenuesResponse>('/venues', {
      params: query,
    });

    return data;
  },
  getOne: async (slug: string) => {
    const { data } = await axiosInstance.get<VenueResponse>(`/venues/${slug}`);

    return data.data;
  },
  search: async (query: SearchVenueQuery) => {
    const { data } = await axiosInstance.get<SearchVenueResponse>('/venues/search', {
      params: {
        ...query,
      },
    });

    return data;
  },
  getByUser: async (userId: number) => {
    const { data } = await axiosInstance.get<VenueResponse>(`/venues/user/${userId}`);

    return data.data;
  },
  create: async (payload: CreateVenueDto) => {
    const { data } = await axiosInstance.post<VenueResponse>('/venues', payload);

    return data;
  },

  update: async ({ id, data: updateVenueData }: UpdateVenuePayload) => {
    const { data } = await axiosInstance.put<VenueResponse>(`/venues/${id}`, updateVenueData);

    return data;
  },
  delete: async (id: number) => {
    await axiosInstance.delete(`/venues/${id}`);
  },
};

export default venueService;
