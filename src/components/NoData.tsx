import { FolderOffOutlined } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

export const NoData = () => {
  return (
    <Box display='flex' alignItems='center' flexDirection='column' justifyContent='center' width='100%'>
      <FolderOffOutlined fontSize='large' />
      <Typography>No data result</Typography>
    </Box>
  );
};
