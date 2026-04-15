import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'kanban-list',
    component: () => import('@/views/KanbanList.vue'),
    meta: { title: 'Kanban List' },
  },
  {
    path: '/kanbans/:id(\\d+)',
    name: 'kanban-board',
    component: () => import('@/views/KanbanBoard.vue'),
    props: true,
    meta: { title: 'Kanban Board' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFound.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});
router.beforeEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }
});

export default router;
