import { createRouter, createWebHistory } from 'vue-router';
import KanbanList from '@/views/KanbanList.vue';
import KanbanBoard from '@/views/KanbanBoard.vue';

const routes = [
  {
    path: '/',
    name: 'kanban-list',
    component: KanbanList,
  },
  {
    path: '/kanbans/:id',
    name: 'kanban-board',
    component: KanbanBoard,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
