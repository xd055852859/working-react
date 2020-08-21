import Loadable from 'react-loadable';

let config= [
  // {
  //   name: '任务',
  //   path: '/task',
  //   exact: true,
  //   component: Loadable({
  //     loader: () => import('../views/task/task'),
  //     loading: () => null,
  //   }),
  // },
  {
    name: "内容",
    path: "/content",
    exact: false,
    component: Loadable({
      loader: () => import("../views/content/content"),
      loading: () => null,
    }),
  }
];

export default config;
