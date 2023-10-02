import { Box, Divider, Modal, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Venue } from '@/services/venue/venue.dto';

export interface ViewVenueInfoBoxProps {
  isOpen: boolean;
  onClose: () => void;
  data: Venue;
}

export const ViewVenueInfoBox = ({ isOpen, onClose, data }: ViewVenueInfoBoxProps) => {
  const { name, description, province, district, address, openAt, closeAt, user } = data;
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
        maxWidth={600}
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
          Venue Information
        </Typography>
        <Divider />
        <Box paddingY={2}>
          <Box display='flex' gap={1}>
            <Typography fontWeight={500}>Name:</Typography>
            <Typography>{name}</Typography>
          </Box>
          <Box display='flex' gap={1}>
            <Typography fontWeight={500}>Description:</Typography>
            <Typography>{description}</Typography>
          </Box>
          <Box display='flex' gap={1}>
            <Typography fontWeight={500}>Province:</Typography>
            <Typography>{province}</Typography>
          </Box>
          <Box display='flex' gap={1}>
            <Typography fontWeight={500}>District:</Typography>
            <Typography>{district}</Typography>
          </Box>
          <Box display='flex' gap={1}>
            <Typography fontWeight={500}>Address:</Typography>
            <Typography>{address}</Typography>
          </Box>
          <Box display='flex' gap={1}>
            <Typography fontWeight={500}>Open:</Typography>
            <Typography>{openAt}</Typography>
          </Box>
          <Box display='flex' gap={1}>
            <Typography fontWeight={500}>Close:</Typography>
            <Typography>{closeAt}</Typography>
          </Box>
          <Box display='flex' gap={1}>
            <Typography fontWeight={500}>User:</Typography>
            <Typography>{user.username}</Typography>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
