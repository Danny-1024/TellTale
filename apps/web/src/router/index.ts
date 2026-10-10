import { createRouter, createWebHistory } from 'vue-router'
import { useLearnStore } from '../stores/learn'
import BookView from '../views/BookView.vue'
import CoverView from '../views/CoverView.vue'
import ListenView from '../views/ListenView.vue'
import PracticeView from '../views/PracticeView.vue'
import RestView from '../views/RestView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'cover', component: CoverView },
    { path: '/learn/:lessonId/listen/:index', name: 'listen', component: ListenView },
    { path: '/learn/:lessonId/practice/:index', name: 'practice', component: PracticeView },
    { path: '/learn/:lessonId/rest', name: 'rest', component: RestView },
    { path: '/learn/:lessonId/book', name: 'book', component: BookView },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach(() => {
  const learn = useLearnStore()
  learn.helpOpen = false
})
