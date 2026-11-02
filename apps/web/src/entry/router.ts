import { createRouter, createWebHistory } from 'vue-router';
import CourseView from '../course/CourseView.vue';
import HomePage from '../pages/HomePage.vue';
import GuidePage from '../pages/GuidePage.vue';
import PrivacyPage from '../pages/PrivacyPage.vue';
import AboutPage from '../pages/AboutPage.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/course', name: 'course', component: CourseView },
    { path: '/guide', name: 'guide', component: GuidePage },
    { path: '/privacy', name: 'privacy', component: PrivacyPage },
    { path: '/about', name: 'about', component: AboutPage },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
});
