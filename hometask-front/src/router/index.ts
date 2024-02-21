import { createRouter, createWebHistory } from 'vue-router'
import Body from "@/components/Home.vue";
import Profile from "@/components/Profile.vue";
import Profiles from "@/components/Profiles.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Body
    },
    {
      path: '/profiles',
      name: 'Profiles',
      component: Profiles
    },
    {
      path: '/profiles/:profileId',
      name: 'Profile',
      component: Profile
    },
  ]
})

export default router
