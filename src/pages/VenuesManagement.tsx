import { ArrowDropDown, ArrowDropUp, Search, Settings } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { OrderEnum } from '@/common/enums/order.enum';
import { AddVenueBox, ConfirmBox, NoData, UpdateVenueBox } from '@/components';
import { ViewVenueInfoBox } from '@/components/ViewVenueInfoBox';
import { useAuth, useBoolean, useDebounce, useMenu } from '@/hooks';
import { CreateVenueDto, Venue, VenueStatusEnum } from '@/services/venue/venue.dto';
import { venueKeys } from '@/services/venue/venue.query';
import venueService from '@/services/venue/venue.service';

const pageLimit = 10;
export const VenuesManagement = () => {
  const { value: isOpenAddBox, setTrue: openAddBox, setFalse: closeAddBox } = useBoolean();
  const { value: isOpenConfirmBox, setTrue: openConfirmBox, setFalse: closeConfirmBox } = useBoolean();
  const { value: isOpenUpdateBox, setTrue: openUpdateBox, setFalse: closeUpdateBox } = useBoolean();
  const { value: isOpenViewBox, setTrue: openViewBox, setFalse: closeViewBox } = useBoolean();

  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<VenueStatusEnum>(VenueStatusEnum.Active);
  const [page, setPage] = useState<number>(1);
  const [keyword, setKeyword] = useState<string>('');

  const { anchorEl, onOpen, onClose, isOpen } = useMenu();

  const { socket } = useAuth();

  const [currentField, setCurrentField] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderEnum>(OrderEnum.Desc);
  const searchDebounce = useDebounce(keyword, 1000);
  const venueInstance = venueKeys.list({
    keyword: searchDebounce,
    status: selectedStatusFilter,
    page,
    limit: pageLimit,
    ...(currentField && {
      sorts: [
        {
          field: currentField,
          order,
        },
      ],
    }),
  });
  const { data: venues, refetch: refetchVenue, isLoading: isVenueLoading } = useQuery(venueInstance);

  const { mutate: mutateCreateVenue } = useMutation({
    mutationFn: (data: CreateVenueDto) => venueService.create(data),
    onSuccess: () => {
      refetchVenue();
      closeAddBox();
      toast.success('Create new venue successfully');
    },
  });

  const { mutate: mutateUpdateVenue } = useMutation({
    mutationFn: venueService.update,
    onSuccess: (data) => {
      refetchVenue();
      closeUpdateBox();
      if (data.data.status !== selectedVenue?.status) {
        socket?.emit('update_venue_status', data.data);
      } else {
        socket?.emit('update_venue', data);
      }
      toast.success('Update venue successfully');
    },
  });

  const { mutate: mutateDeleteVenue, isLoading: isLoadingDelete } = useMutation({
    mutationFn: (id: number) => venueService.delete(id),
    onSuccess: () => {
      refetchVenue();
      closeConfirmBox();
      toast.success('Delete venue successfully');
    },
  });

  const handleToggleOrder = () => {
    if (order === OrderEnum.Asc) {
      setOrder(OrderEnum.Desc);
    } else {
      setOrder(OrderEnum.Asc);
    }
  };

  const handleSort = (field: string) => {
    if (field === currentField) {
      handleToggleOrder();
    } else {
      setCurrentField(field);
      setOrder(OrderEnum.Desc);
    }
  };

  const handleCreateVenue = (data: CreateVenueDto) => mutateCreateVenue(data);

  const handleDeleteVenue = () => selectedVenue && mutateDeleteVenue(selectedVenue.id);

  const colorStatus = {
    [VenueStatusEnum.Active]: 'default.main',
    [VenueStatusEnum.Waiting]: 'primary.main',
    [VenueStatusEnum.Cancel]: 'error.main',
  };

  useEffect(() => {
    refetchVenue();
  }, [page, order, currentField, refetchVenue]);

  return (
    <>
      <Box display='flex' justifyContent='space-between'>
        <Button variant='contained' onClick={openAddBox} size='small'>
          Add
        </Button>
        <TextField
          placeholder='Search'
          size='small'
          fullWidth
          value={keyword}
          sx={{ maxWidth: 600 }}
          onChange={(e) => setKeyword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton edge='end'>{isVenueLoading ? <CircularProgress size='small' /> : <Search />}</IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Select
          value={selectedStatusFilter}
          size='small'
          onChange={(e) => setSelectedStatusFilter(e.target.value as VenueStatusEnum)}
        >
          {Object.entries(VenueStatusEnum).map(([key, value]) => (
            <MenuItem key={key} value={value}>
              {key}
            </MenuItem>
          ))}
        </Select>
      </Box>
      {venues && (
        <>
          <Table size='small' sx={{ marginY: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}
                    onClick={() => {
                      handleSort('id');
                    }}
                  >
                    ID
                    {order === OrderEnum.Asc && currentField === 'id' ? <ArrowDropDown /> : <ArrowDropUp />}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}
                    onClick={() => {
                      handleSort('name');
                    }}
                  >
                    Name
                    {order === OrderEnum.Asc && currentField === 'name' ? <ArrowDropDown /> : <ArrowDropUp />}
                  </Box>
                </TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {venues.data.map((venue) => (
                <TableRow key={venue.id}>
                  <TableCell>{venue.id}</TableCell>
                  <TableCell>{venue.name}</TableCell>
                  <TableCell>{venue.description}</TableCell>
                  <TableCell>{venue.address}</TableCell>
                  <TableCell sx={{ color: colorStatus[venue.status] }}>{venue.status}</TableCell>
                  <TableCell>{venue.user.username}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={(e) => {
                        setSelectedVenue(venue);
                        onOpen(e);
                      }}
                    >
                      <Settings />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {venues.data.length <= 0 && <NoData />}

          {venues.pageInfo.pageCount > 1 && (
            <Pagination count={venues.pageInfo.pageCount} page={page} onChange={(_, value) => setPage(value)} />
          )}

          <ConfirmBox
            title='Confirm delete?'
            subTitle='Data will be delete from your system but you still can restore it'
            loading={isLoadingDelete}
            isOpen={isOpenConfirmBox}
            onClose={closeConfirmBox}
            onAccept={handleDeleteVenue}
          />

          <Menu
            id='category-menu'
            anchorEl={anchorEl}
            open={isOpen}
            onClose={onClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem
              onClick={() => {
                onClose();
                openViewBox();
              }}
            >
              View
            </MenuItem>
            <MenuItem
              onClick={() => {
                onClose();
                openUpdateBox();
              }}
            >
              Update
            </MenuItem>
            <MenuItem
              onClick={() => {
                onClose();
                openConfirmBox();
              }}
            >
              Delete
            </MenuItem>
          </Menu>
        </>
      )}
      {isOpenViewBox && selectedVenue && (
        <ViewVenueInfoBox data={selectedVenue} isOpen={isOpenViewBox} onClose={closeViewBox} />
      )}
      <AddVenueBox isOpen={isOpenAddBox} onClose={closeAddBox} onSubmit={(data) => handleCreateVenue(data)} />
      {isOpenUpdateBox && selectedVenue && (
        <UpdateVenueBox
          data={selectedVenue}
          isOpen={isOpenUpdateBox}
          onClose={() => {
            closeUpdateBox();
            setSelectedVenue(null);
          }}
          onSubmit={mutateUpdateVenue}
        />
      )}
    </>
  );
};
