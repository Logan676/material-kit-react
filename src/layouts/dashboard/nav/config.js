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
    title: '博客',
    path: '/dashboard/blog',
    icon: icon('ic_blog'),
  },
  {
    title: '书籍',
    path: '/dashboard/books',
    icon: icon('ic_blog'),
  },
  {
    title: '出版社',
    path: '/dashboard/publisher',
    icon: icon('ic_cart'),
  },
  {
    title: '作者',
    path: '/dashboard/authors',
    icon: icon('ic_user'),
  },
  {
    title: '标签',
    path: '/dashboard/tags',
    icon: icon('ic_cart'),
  },
  {
    title: '主题阅读',
    path: '/dashboard/topics',
    icon: icon('ic_cart'),
  },
  {
    title: '书摘',
    path: '/dashboard/excerpts',
    icon: icon('ic_cart'),
  },
  {
    title: '书评',
    path: '/dashboard/reviews',
    icon: icon('ic_cart'),
  },
  {
    title: 'dev',
    path: '/dashboard/dev',
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
