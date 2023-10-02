import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Box, Button, Divider, MenuItem, Modal, Select, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { locationKeys } from '@/services/location/location.query';
import { UpdateVenueData, UpdateVenuePayload, Venue, VenueStatusEnum } from '@/services/venue/venue.dto';

export interface UpdateVenueProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  data: Venue;
  onSubmit: (data: UpdateVenuePayload) => void;
}

const schema = object({
  name: string().required('Please fill in this field'),
  description: string().required('Please fill in this field'),
  province: string().required('Please fill in this field'),
  district: string().required('Please fill in this field'),
  address: string().required('Please fill in this field'),
  openAt: string().required('Please fill in this field'),
  closeAt: string().required('Please fill in this field'),
  status: string().oneOf(Object.values(VenueStatusEnum), '').required(),
});

export const UpdateVenueBox = ({ isOpen, isLoading, onClose, data, onSubmit }: UpdateVenueProps) => {
  const { id, name, description, province, district, address, openAt, closeAt, status } = data;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name,
      description,
      province,
      district,
      address,
      openAt,
      closeAt,
      status,
    },
  });

  const [currentProvince, setCurrentProvince] = useState<string>(province);
  const [currentDistrict, setCurrentDistrict] = useState<string[]>();

  const locationInstace = locationKeys.list();
  const { data: provinces } = useQuery(locationInstace);

  const onSubmitHandler = (updateData: UpdateVenueData) => onSubmit({ id, data: updateData });

  useEffect(() => {
    if (provinces) {
      setCurrentDistrict(
        provinces.filter((item) => item.name === currentProvince)[0]?.districts.map((district) => district.name),
      );
    }
  }, [currentProvince, provinces]);

  watch('status');

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
        minWidth={400}
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
          Update Venue
        </Typography>
        <Divider />
        <Box component='form' noValidate onSubmit={handleSubmit(onSubmitHandler)}>
          <Box paddingY={2}>
            <Typography variant='body2' fontStyle='italic'>
              Name:
            </Typography>
            <TextField {...register('name')} fullWidth type='email' disabled={isLoading} size='small' />
          </Box>
          <Box paddingY={2}>
            <Typography variant='body2' fontStyle='italic'>
              Description:
            </Typography>
            <TextField {...register('description')} fullWidth type='email' disabled={isLoading} size='small' />
          </Box>

          <Box paddingY={2}>
            <Typography variant='body2' fontStyle='italic'>
              Address:
            </Typography>
            <TextField {...register('address')} fullWidth type='email' disabled={isLoading} size='small' />
          </Box>

          <Box paddingY={2}>
            <Typography variant='body2'>Province</Typography>
            <Autocomplete
              size='small'
              options={provinces?.map((province) => province.name) || []}
              onInputChange={(_, value) => setCurrentProvince(value)}
              renderInput={(params) => <TextField {...params} {...register('province')} />}
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
              Status:
            </Typography>
            <Select
              defaultValue={status}
              onChange={(e) => setValue('status', e.target.value as VenueStatusEnum)}
              size='small'
              fullWidth
            >
              {Object.entries(VenueStatusEnum).map(([key, value]) => (
                <MenuItem value={value} key={key}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box display='flex' justifyContent='center' gap={4} padding={4}>
            <LoadingButton loading={isLoading} variant='contained' type='submit'>
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
