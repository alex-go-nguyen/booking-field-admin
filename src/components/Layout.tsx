import { Category, ChevronLeft, Dashboard, Grass, LogoutOutlined, Menu as MenuIcon, People } from '@mui/icons-material';
import {
  IconButton,
  Toolbar,
  Typography,
  styled,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Container,
} from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { RoleEnum } from '@/common/enums/role.enum';
import { useAuth, useBoolean } from '@/hooks';

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

export const MainLayout = () => {
  const navigate = useNavigate();

  const { profile, logout } = useAuth();

  const { value, toggle } = useBoolean(true);

  if (!profile || profile?.role !== RoleEnum.Admin) {
    navigate('/login');
  }

  const { pathname } = useLocation();

  const menuItems = [
    { pathname: '/', label: 'Dashboard', icon: <Dashboard /> },
    { pathname: '/categories', label: 'Categories', icon: <Category /> },
    { pathname: '/users', label: 'Users', icon: <People /> },
    { pathname: '/venues', label: 'Venues', icon: <Grass /> },
  ];

  return (
    <Box display='flex'>
      <AppBar position='absolute' open={value}>
        <Toolbar
          sx={{
            pr: '24px',
          }}
        >
          <IconButton
            edge='start'
            color='inherit'
            aria-label='open drawer'
            onClick={toggle}
            sx={{
              marginRight: '36px',
              ...(value && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography component='h1' variant='h6' color='inherit' noWrap sx={{ flexGrow: 1 }}>
            {menuItems.find((item) => item.pathname === pathname)?.label}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant='permanent' open={value}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <IconButton onClick={toggle}>
            <ChevronLeft />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component='nav'>
          {menuItems.map((item) => (
            <ListItemButton onClick={() => navigate(item.pathname)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
          <ListItemButton onClick={logout}>
            <ListItemIcon>
              <LogoutOutlined />
            </ListItemIcon>
            <ListItemText primary='Đăng xuất' />
          </ListItemButton>
        </List>
      </Drawer>
      <Box
        component='main'
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Container maxWidth='xl' sx={{ mt: 12, mb: 4 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};
