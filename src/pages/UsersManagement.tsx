import { Delete, Edit } from '@mui/icons-material';
import { IconButton, Pagination, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { USER_PAGE_LIMIT } from '@/common/constants';
import { OrderEnum } from '@/common/enums/order.enum';
import { ConfirmBox, UpdateUserBox } from '@/components';
import { useAuth, useBoolean } from '@/hooks';
import { UpdateUserPayload, User } from '@/services/user/user.dto';
import { userKeys } from '@/services/user/user.query';
import userService from '@/services/user/user.service';

export const UsersManagement = () => {
  const queryClient = useQueryClient();

  const [seletedUser, setSeletedUser] = useState<User | null>(null);

  const [page, setPage] = useState(1);

  const { value: isOpenConfirmBox, setTrue: openConfirmBox, setFalse: closeConfirmBox } = useBoolean(false);
  const { value: isOpenUpdateBox, setTrue: openUpdateBox, setFalse: closeUpdateBox } = useBoolean(false);

  const { profile } = useAuth();

  const userInstance = userKeys.list({
    page,
    limit: USER_PAGE_LIMIT,
    sorts: [
      {
        field: 'createdAt',
        order: OrderEnum.Desc,
      },
    ],
  });
  const { data, refetch } = useQuery({ ...userInstance, enabled: !!profile });

  const { mutate: deleteMutation, isLoading: isDeleteUserLoading } = useMutation({
    mutationFn: (id: number) => userService.delete(id),
    onSuccess: () => {
      refetch();
      closeConfirmBox();
      toast.success('Delete user successfully');
    },
  });

  const { mutate: updateMutation, isLoading: isUpdateLoading } = useMutation({
    mutationFn: (payload: UpdateUserPayload) => userService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      closeUpdateBox();
      toast.success('Update user successfully!');
    },
  });

  const handleDeleteUser = () => seletedUser && deleteMutation(seletedUser.id);

  const handleUpdate = (data: UpdateUserPayload) => updateMutation(data);

  return data ? (
    <>
      <Table size='medium' sx={{ marginY: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>FullName</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>CreatedAt</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.data.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{`${user.lastName} ${user.firstName}`}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{moment(user.createdAt).format('MM/DD/YYYY')}</TableCell>
              <TableCell>
                <IconButton
                  onClick={() => {
                    setSeletedUser(user);
                    openUpdateBox();
                  }}
                  color='secondary'
                >
                  <Edit />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setSeletedUser(user);
                    openConfirmBox();
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
      <ConfirmBox
        title='Confirm delete user?'
        subTitle='User will be delete from your system but you still can restore it'
        loading={isDeleteUserLoading}
        isOpen={isOpenConfirmBox}
        onClose={closeConfirmBox}
        onAccept={handleDeleteUser}
      />
      {seletedUser && (
        <UpdateUserBox
          onSubmit={handleUpdate}
          isLoading={isUpdateLoading}
          isOpen={isOpenUpdateBox}
          onClose={closeUpdateBox}
          data={seletedUser}
        />
      )}
      {data.pageInfo.pageCount > 1 && (
        <Pagination count={data.pageInfo.pageCount} page={page} onChange={(_, value) => setPage(value)} />
      )}
    </>
  ) : (
    <Typography>Chưa có người dùng nào trong hệ thống</Typography>
  );
};
