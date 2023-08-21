import { Navigate, useRoutes, useNavigate } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import PublisherPage from './pages/PublisherPage';
import PublisherDetailPage from './pages/PublisherDetailPage';
import AuthorListPage from './pages/AuthorListPage';
import AuthorDetailPage from './pages/AuthorDetailPage';
import TagListPage from './pages/TagListPage';
import TopicListPage from './pages/TopicListPage';
import BookShelfPage from './pages/BookShelfPage';
import Dev from './pages/Dev';
import Reviews from './pages/Reviews';
import Excerpts from './pages/Excerpts';
import BookDetailPage from './pages/BookDetailPage';
import BookListPage from './pages/BookListPage';
import TagManagePage from './pages/TagManagePage';
import TopicManagePage from './pages/TopicManagePage';
// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        // { path: 'user', element: <UserPage /> },
        // { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'publisher', element: <PublisherPage /> },
        { path: 'publisher/:id', element: <PublisherDetailPage /> },
        { path: 'authors', element: <AuthorListPage /> },
        { path: 'authors/:id', element: <AuthorDetailPage /> },
        { path: 'books', element: <BookShelfPage /> },
        { path: 'tags', element: <TagListPage /> },
        { path: 'tagmanage', element: <TagManagePage /> },
        { path: 'topics', element: <TopicListPage /> },
        { path: 'topicmanage', element: <TopicManagePage /> },
        { path: 'dev', element: <Dev /> },
        { path: 'reviews', element: <Reviews /> },
        { path: 'excerpts', element: <Excerpts /> },
        { path: 'bookbrowse/:id', element: <BookDetailPage /> },
        { path: 'bookbrowse', element: <BookListPage /> },
        { path: 'booklist/:id', element: <BookListPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
