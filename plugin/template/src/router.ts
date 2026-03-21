import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("./pages/Home.vue"),
    },
    // Add new pages here:
    // {
    //   path: "/your-feature",
    //   name: "your-feature",
    //   component: () => import("./pages/YourFeature.vue"),
    // },
  ],
});

export default router;
