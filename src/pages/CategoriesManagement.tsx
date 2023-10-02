import { Settings } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { OrderEnum } from '@/common/enums/order.enum';
import { AddPitchCategoryBox, UpdatePitchCategoryBox, ConfirmBox, NoData } from '@/components';
import { useBoolean, useMenu } from '@/hooks';
import {
  PitchCategoriesResponse,
  PitchCategory,
  UpdatePitchCategoryPayload,
} from '@/services/pitch_category/pitch-category.dto';
import { pitchCategoryKeys } from '@/services/pitch_category/pitch-category.query';
import pitchCategoryService from '@/services/pitch_category/pitch-category.service';

export const CategoriesManagement = () => {
  const queryClient = useQueryClient();

  const pitchCategoryInstance = pitchCategoryKeys.list({
    sorts: [
      {
        field: 'id',
        order: OrderEnum.Desc,
      },
    ],
  });

  const { data: categories, refetch: refetchCategories } = useQuery(pitchCategoryInstance);

  const [selectedPitchCategory, setSelectedPitchCategory] = useState<PitchCategory | null>(null);

  const { value: isOpenConfirmBox, setTrue: openConfirmBox, setFalse: closeConfirmBox } = useBoolean(false);
  const { value: isOpenUpdateBox, setTrue: openUpdateBox, setFalse: closeUpdateBox } = useBoolean(false);
  const { value: isOpenAddBox, setTrue: openAddBox, setFalse: closeAddBox } = useBoolean(false);

  const { anchorEl, onOpen, onClose, isOpen } = useMenu();

  const { mutate: deleteMutation, isLoading: isDeleteLoading } = useMutation({
    mutationFn: (id: number) => pitchCategoryService.delete(id),
    onSuccess: () => {
      refetchCategories();
      closeConfirmBox();
      toast.success('Delete pitch category successfully!');
    },
  });

  const { mutate: updateMutation, isLoading: isUpdateLoading } = useMutation({
    mutationFn: (payload: UpdatePitchCategoryPayload) => pitchCategoryService.update(payload),
    onSuccess: (data) => {
      toast.success('Update pitch category successfully!');
      queryClient.setQueryData<PitchCategoriesResponse>(
        pitchCategoryInstance.queryKey,
        (oldData) =>
          oldData && {
            ...oldData,
            data: oldData.data.map((item) => (item.id === data.data.id ? data.data : item)),
          },
      );
      closeUpdateBox();
    },
  });

  const handleUpdateSubmit = (data: UpdatePitchCategoryPayload) => updateMutation(data);

  const handleDeletePitchCategory = () => selectedPitchCategory && deleteMutation(selectedPitchCategory.id);

  return (
    <>
      <Button variant='contained' onClick={openAddBox}>
        Add
      </Button>
      {categories && (
        <>
          <Table size='medium' sx={{ marginY: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Thumbnail</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>CreatedAt</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.data.map((pitchCategory) => (
                <TableRow key={pitchCategory.id}>
                  <TableCell>{pitchCategory.id}</TableCell>
                  <TableCell>{pitchCategory.name}</TableCell>
                  <TableCell>
                    <Box
                      component='img'
                      src={pitchCategory.thumbnail}
                      width={60}
                      height={60}
                      sx={{ objectFit: 'cover' }}
                    />
                  </TableCell>
                  <TableCell>{pitchCategory.description}</TableCell>
                  <TableCell>{moment(pitchCategory.createdAt).format('MM/DD/YYYY')}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={(e) => {
                        setSelectedPitchCategory(pitchCategory);
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
          {categories.data.length <= 0 && <NoData />}

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

          {selectedPitchCategory && isOpenUpdateBox && (
            <UpdatePitchCategoryBox
              isLoading={isUpdateLoading}
              onSubmit={handleUpdateSubmit}
              isOpen={isOpenUpdateBox}
              onClose={() => {
                closeUpdateBox();
                setSelectedPitchCategory(null);
              }}
              data={selectedPitchCategory}
            />
          )}
          <ConfirmBox
            title='Confirm delete?'
            subTitle='Data will be delete from your system but you still can restore it'
            loading={isDeleteLoading}
            isOpen={isOpenConfirmBox}
            onClose={closeConfirmBox}
            onAccept={handleDeletePitchCategory}
          />
        </>
      )}
      <AddPitchCategoryBox isOpen={isOpenAddBox} onClose={closeAddBox} />
    </>
  );
};
