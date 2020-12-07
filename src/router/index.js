import { createRouter, createWebHistory } from "vue-router";
import Index from "@/views/Index.vue";

const routes = [
  {
    path: "/",
    name: "Index",
    component: Index,
    children: [
      {
        path: "",
        component: () => import("../views/MapOnly.vue")
      },
      {
        path: "map-places",
        component: () => import("../views/MapPlaces.vue")
      },
      {
        path: "map-marker",
        component: () => import("../views/MapMarker.vue")
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
