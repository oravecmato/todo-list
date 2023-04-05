import {createWebHistory, createRouter, RouteRecordRaw, RouteLocationNormalized} from "vue-router";
import ListListing from "../views/ListListing.vue"
import SingleList from "../views/SingleList.vue"

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "home",
        component: ListListing,
    },
    {
        path: "/list/:id?",
        name: "list",
        component: SingleList,
        props: (route: RouteLocationNormalized) => {
            return {listId: route.params.id}
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    scrollBehavior(to, from, savedPosition) {
        console.log('SavedPosition', savedPosition)

        if (savedPosition) {
            return savedPosition
        }

        return { top: 0, left: 0 }
    },
    routes,
});

export default router;