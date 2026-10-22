import { createRouter, createWebHistory } from 'vue-router';
import EntryView from '../course/CourseView.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'entry', component: EntryView },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
});
