import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { MainLayout } from './components';
import { CategoriesManagement, Dashboard, Login, UsersManagement, VenuesManagement } from './pages';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'users',
        element: <UsersManagement />,
      },
      {
        path: 'categories',
        element: <CategoriesManagement />,
      },
      {
        path: 'venues',
        element: <VenuesManagement />,
      },
    ],
  },
  {
    path: 'login',
    element: <Login />,
  },
]);

function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <ToastContainer />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  );
}

export default App;
