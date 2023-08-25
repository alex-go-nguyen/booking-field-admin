import { Delete, Edit } from '@mui/icons-material';
import { Box, Button, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { OrderEnum } from '@/common/enums/order.enum';
import { AddPitchCategoryBox, UpdatePitchCategoryBox } from '@/components';
import { ConfirmBox } from '@/components/ConfirmBox';
import { useBoolean } from '@/hooks';
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
        field: '_id',
        order: OrderEnum.Desc,
      },
    ],
  });

  const { data, refetch } = useQuery(pitchCategoryInstance);

  const [selectedPitchCategory, setSelectedPitchCategory] = useState<PitchCategory | null>(null);

  const { value: isOpenConfirmBox, setTrue: openConfirmBox, setFalse: closeConfirmBox } = useBoolean(false);
  const { value: isOpenUpdateBox, setTrue: openUpdateBox, setFalse: closeUpdateBox } = useBoolean(false);
  const { value: isOpenAddBox, setTrue: openAddBox, setFalse: closeAddBox } = useBoolean(false);

  const { mutate: deleteMutation, isLoading: isDeleteLoading } = useMutation({
    mutationFn: (id: number) => pitchCategoryService.delete(id),
    onSuccess: () => {
      refetch();
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
            data: oldData.data.map((item) => (item._id === data.data._id ? data.data : item)),
          },
      );
      closeUpdateBox();
    },
  });

  const handleUpdateSubmit = (data: UpdatePitchCategoryPayload) => updateMutation(data);

  const handleDeletePitchCategory = () => selectedPitchCategory && deleteMutation(selectedPitchCategory._id);

  return (
    data && (
      <>
        <Button variant='contained' onClick={openAddBox}>
          Add
        </Button>
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
            {data.data.map((pitchCategory) => (
              <TableRow key={pitchCategory._id}>
                <TableCell>{pitchCategory._id}</TableCell>
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
                    onClick={() => {
                      setSelectedPitchCategory(pitchCategory);
                      openUpdateBox();
                    }}
                    color='secondary'
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      openConfirmBox();
                      setSelectedPitchCategory(pitchCategory);
                    }}
                    color='primary'
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <AddPitchCategoryBox isOpen={isOpenAddBox} onClose={closeAddBox} />
        {selectedPitchCategory && (
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
    )
  );
};
