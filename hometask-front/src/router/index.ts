import { createRouter, createWebHistory } from 'vue-router'
import HomePage from "@/components/HomePage.vue";
import ProfilePage from "@/components/ProfilePage.vue";
import ProfilesPage from "@/components/ProfilesPage.vue";
import ContractPage from "@/components/ContractPage.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '/profiles',
      name: 'ProfilesPage',
      component: ProfilesPage
    },
    {
      path: '/profiles/:profileId',
      name: 'ProfilePage',
      component: ProfilePage
    },
    {
      path: '/contracts/:contractId/:profileId',
      name: 'Contract',
      component: ContractPage
    },
  ]
})

export default router
