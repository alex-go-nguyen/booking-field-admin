import axios from 'axios';
import { ProvincesData, SearchLocationquery } from './location.dto';

const locationService = {
  getProvinces: async (query: SearchLocationquery) => {
    const { keyword, type } = query;
    const baseUrl = keyword
      ? `${import.meta.env.VITE_PROVINCE_API_URL}/${type}/search`
      : import.meta.env.VITE_PROVINCE_API_URL;

    const { data } = await axios.get<ProvincesData[]>(`${baseUrl}/`, {
      params: {
        q: keyword,
        depth: 2,
      },
    });

    return data;
  },
};

export default locationService;
