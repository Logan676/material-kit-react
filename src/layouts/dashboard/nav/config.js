// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'blog',
    path: '/dashboard/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'books',
    path: '/dashboard/books',
    icon: icon('ic_blog'),
  },
  {
    title: 'publisher',
    path: '/dashboard/publisher',
    icon: icon('ic_cart'),
  },
  {
    title: 'authors',
    path: '/dashboard/authors',
    icon: icon('ic_user'),
  },
  {
    title: 'tags',
    path: '/dashboard/tags',
    icon: icon('ic_cart'),
  },
  {
    title: 'topics',
    path: '/dashboard/topics',
    icon: icon('ic_cart'),
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;
