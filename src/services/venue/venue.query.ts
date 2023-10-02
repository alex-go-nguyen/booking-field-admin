import { SearchVenueQuery, VenueQuery } from './venue.dto';
import venueService from './venue.service';
import { defineQuery } from '@/utils/defineQuery';

export const venueKeys = {
  all: ['venues'] as const,
  lists: () => [...venueKeys.all, 'list'] as const,
  list: (query: VenueQuery = {}) => defineQuery([...venueKeys.lists(), query], () => venueService.getAll(query)),
  details: () => [venueKeys.all, 'detail'] as const,
  detail: (slug?: string) =>
    defineQuery([...venueKeys.details(), slug], () => {
      if (slug) {
        return venueService.getOne(slug);
      }
    }),
  searches: () => [venueKeys.all, 'search'] as const,
  search: (query: SearchVenueQuery) => defineQuery([...venueKeys.searches(), query], () => venueService.search(query)),
};
