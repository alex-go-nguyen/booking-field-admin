import { Search, Settings } from '@mui/icons-material';
import {
  CircularProgress,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { USER_PAGE_LIMIT } from '@/common/constants';
import { OrderEnum } from '@/common/enums/order.enum';
import { ConfirmBox, NoData, UpdateUserBox } from '@/components';
import { useAuth, useBoolean, useDebounce, useMenu } from '@/hooks';
import { UpdateUserPayload, User } from '@/services/user/user.dto';
import { userKeys } from '@/services/user/user.query';
import userService from '@/services/user/user.service';

export const UsersManagement = () => {
  const queryClient = useQueryClient();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [page, setPage] = useState(1);

  const [keyword, setKeyword] = useState('');

  const { value: isOpenConfirmBox, setTrue: openConfirmBox, setFalse: closeConfirmBox } = useBoolean(false);
  const { value: isOpenUpdateBox, setTrue: openUpdateBox, setFalse: closeUpdateBox } = useBoolean(false);

  const { profile } = useAuth();

  const keywordDebounce = useDebounce(keyword, 1000);
  const userInstance = userKeys.list({
    keyword: keywordDebounce,
    page,
    limit: USER_PAGE_LIMIT,
    sorts: [
      {
        field: 'createdAt',
        order: OrderEnum.Desc,
      },
    ],
  });
  const {
    data: users,
    refetch: refetchUsers,
    isLoading: isLoadingUsers,
  } = useQuery({ ...userInstance, enabled: !!profile });

  const { anchorEl, onOpen, onClose, isOpen } = useMenu();

  const { mutate: deleteMutation, isLoading: isDeleteUserLoading } = useMutation({
    mutationFn: (id: number) => userService.delete(id),
    onSuccess: () => {
      refetchUsers();
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

  const handleDeleteUser = () => selectedUser && deleteMutation(selectedUser.id);

  const handleUpdate = (data: UpdateUserPayload) => updateMutation(data);

  return (
    users && (
      <>
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
                <IconButton edge='end'>{isLoadingUsers ? <CircularProgress size='small' /> : <Search />}</IconButton>
              </InputAdornment>
            ),
          }}
        />
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
            {users.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{`${user.lastName} ${user.firstName}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{moment(user.createdAt).format('MM/DD/YYYY')}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={(e) => {
                      setSelectedUser(user);
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
        {users.data.length <= 0 && <NoData />}

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

        <ConfirmBox
          title='Confirm delete user?'
          subTitle='User will be delete from your system but you still can restore it'
          loading={isDeleteUserLoading}
          isOpen={isOpenConfirmBox}
          onClose={closeConfirmBox}
          onAccept={handleDeleteUser}
        />
        {isOpenUpdateBox && selectedUser && (
          <UpdateUserBox
            onSubmit={handleUpdate}
            isLoading={isUpdateLoading}
            isOpen={isOpenUpdateBox}
            onClose={closeUpdateBox}
            data={selectedUser}
          />
        )}
        {users.pageInfo.pageCount > 1 && (
          <Pagination count={users.pageInfo.pageCount} page={page} onChange={(_, value) => setPage(value)} />
        )}
      </>
    )
  );
};
