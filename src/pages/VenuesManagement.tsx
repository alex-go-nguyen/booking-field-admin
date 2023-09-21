import { Settings } from '@mui/icons-material';
import { Button, IconButton, Menu, MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { AddVenueBox, ConfirmBox } from '@/components';
import { useBoolean, useMenu } from '@/hooks';
import { CreateVenueDto, Venue } from '@/services/venue/venue.dto';
import { venueKeys } from '@/services/venue/venue.query';
import venueService from '@/services/venue/venue.service';

export const VenuesManagement = () => {
  const { value: isOpenAddBox, setTrue: openAddBox, setFalse: closeAddBox } = useBoolean();
  const { value: isOpenConfirmBox, setTrue: openConfirmBox, setFalse: closeConfirmBox } = useBoolean();

  const [selectedVenue, setSelectedVenue] = useState<Venue>();

  const { anchorEl, onOpen, onClose, isOpen } = useMenu();

  const venueInstance = venueKeys.list({});
  const { data: venues, refetch: refetchVenue } = useQuery(venueInstance);

  const { mutate: mutateCreateVenue } = useMutation({
    mutationFn: (data: CreateVenueDto) => venueService.create(data),
    onSuccess: () => {
      refetchVenue();
      closeAddBox();
      toast.success('Create new venue successfully');
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

  const handleCreateVenue = (data: CreateVenueDto) => mutateCreateVenue(data);

  const handleDeleteVenue = () => selectedVenue && mutateDeleteVenue(selectedVenue.id);

  return (
    <>
      <Button variant='contained' onClick={openAddBox}>
        Add
      </Button>
      {venues && (
        <>
          <Table size='small' sx={{ marginY: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Address</TableCell>
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
            <MenuItem onClick={() => openConfirmBox()}>Delete</MenuItem>
          </Menu>
        </>
      )}
      <AddVenueBox isOpen={isOpenAddBox} onClose={closeAddBox} onSubmit={(data) => handleCreateVenue(data)} />
    </>
  );
};
