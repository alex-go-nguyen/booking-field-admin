import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Box, Button, Divider, Modal, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { number, object, string } from 'yup';
import { RoleEnum } from '@/common/enums/role.enum';
import { locationKeys } from '@/services/location/location.query';
import { userKeys } from '@/services/user/user.query';
import { CreateVenueDto } from '@/services/venue/venue.dto';

export interface AddVenueBoxProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateVenueDto) => void;
}
const schema = object({
  name: string().required('Please fill in this field'),
  description: string().required('Please fill in this field'),
  province: string().required('Please fill in this field'),
  district: string().required('Please fill in this field'),
  address: string().required('Please fill in this field'),
  openAt: string().required('Please fill in this field'),
  closeAt: string().required('Please fill in this field'),
  user: number().required('Please fill in this field'),
});
export const AddVenueBox = ({ isOpen, onClose, onSubmit }: AddVenueBoxProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [currentProvince, setCurrentProvince] = useState<string>();
  const [currentDistrict, setCurrentDistrict] = useState<string[]>();

  const locationInstace = locationKeys.list({});
  const { data: provinces } = useQuery(locationInstace);

  const userInstance = userKeys.list({ role: RoleEnum.User });
  const { data: users } = useQuery(userInstance);

  const onSubmitHandler = (data: CreateVenueDto) => onSubmit(data);

  useEffect(() => {
    if (provinces) {
      setCurrentDistrict(
        provinces.filter((item) => item.name === currentProvince)[0]?.districts.map((district) => district.name),
      );
    }
  }, [currentProvince, provinces]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby='parent-modal-title'
      aria-describedby='parent-modal-description'
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Box
        paddingX={4}
        width={500}
        bgcolor='primary.contrastText'
        borderRadius={4}
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.3,
        }}
      >
        <Typography variant='h5' textAlign='center' fontWeight={700} paddingY={2}>
          Add new venue
        </Typography>
        <Divider />
        <Box component='form' noValidate onSubmit={handleSubmit(onSubmitHandler)}>
          <Box paddingY={2}>
            <Typography variant='body2' fontStyle='italic'>
              Name
            </Typography>
            <TextField {...register('name')} fullWidth size='small' />
            {errors.name && (
              <Typography variant='body2' color='error.main'>
                {errors.name.message}
              </Typography>
            )}
          </Box>

          <Box paddingY={2}>
            <Typography variant='body2' fontStyle='italic'>
              Description
            </Typography>
            <TextField {...register('description')} fullWidth size='small' />
            {errors.description && (
              <Typography variant='body2' color='error.main'>
                {errors.description.message}
              </Typography>
            )}
          </Box>

          <Box paddingY={2}>
            <Typography variant='body2'>Province</Typography>
            <Autocomplete
              size='small'
              options={provinces?.map((province) => province.name) || []}
              onInputChange={(_, value) => setCurrentProvince(value)}
              renderInput={(params) => <TextField {...params} value={currentProvince} {...register('province')} />}
            />
            {errors.province && (
              <Typography variant='body2' color='error.main'>
                {errors.province.message}
              </Typography>
            )}
          </Box>

          <Box paddingY={2}>
            <Typography variant='body2'>District</Typography>
            <Autocomplete
              size='small'
              options={currentDistrict || []}
              renderInput={(params) => <TextField {...params} {...register('district')} />}
            />
            {errors.district && (
              <Typography variant='body2' color='error.main'>
                {errors.district.message}
              </Typography>
            )}
          </Box>

          <Box paddingY={2}>
            <Typography variant='body2' fontStyle='italic'>
              Address
            </Typography>
            <TextField {...register('address')} fullWidth size='small' />
            {errors.address && (
              <Typography variant='body2' color='error.main'>
                {errors.address.message}
              </Typography>
            )}
          </Box>

          <Box paddingY={2}>
            <Typography variant='body2' fontStyle='italic'>
              Open time
            </Typography>
            <TextField {...register('openAt')} fullWidth size='small' />
            {errors.openAt && (
              <Typography variant='body2' color='error.main'>
                {errors.openAt.message}
              </Typography>
            )}
          </Box>

          <Box paddingY={2}>
            <Typography variant='body2' fontStyle='italic'>
              Close time
            </Typography>
            <TextField {...register('closeAt')} fullWidth size='small' />
            {errors.closeAt && (
              <Typography variant='body2' color='error.main'>
                {errors.closeAt.message}
              </Typography>
            )}
          </Box>

          <Box paddingY={2}>
            <Typography variant='body2' fontStyle='italic'>
              User
            </Typography>
            {/* <TextField {...register('user')} fullWidth size="small" /> */}
            <Autocomplete
              disablePortal
              id='select-user'
              options={users?.data || []}
              getOptionLabel={(option) => option.username}
              fullWidth
              size='small'
              onChange={(_, value) => value && setValue('user', value.id)}
              renderOption={(props, option) => (
                <Box component='li' sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                  <Box>
                    <Typography>{option.username}</Typography>
                  </Box>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password',
                  }}
                />
              )}
            />
            {errors.user && (
              <Typography variant='body2' color='error.main'>
                {errors.user.message}
              </Typography>
            )}
          </Box>

          <Box display='flex' justifyContent='center' gap={4} padding={4}>
            <LoadingButton loading={false} variant='contained' type='submit'>
              Save
            </LoadingButton>
            <Button variant='text' onClick={onClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
