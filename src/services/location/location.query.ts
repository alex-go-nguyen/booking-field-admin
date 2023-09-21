import { SearchLocationquery } from './location.dto';
import locationService from './location.service';
import { defineQuery } from '@/utils/defineQuery';

export const locationKeys = {
  all: ['provinces'] as const,
  lists: () => [...locationKeys.all, 'list'] as const,
  list: (query: SearchLocationquery) =>
    defineQuery([...locationKeys.lists(), query], () => locationService.getProvinces(query)),
};
