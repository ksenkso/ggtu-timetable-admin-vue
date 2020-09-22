import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import {api} from "@/api";
import lessons from "./lessons";
import teachers from "@/router/teachers";
import groups from "@/router/groups";
import cabinets from "@/router/cabinets";
import buildings from "@/router/buildings";
import timetable from "@/router/timetable";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'Home',
        redirect: '/groups'
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    },
    ...groups,
    ...teachers,
    ...lessons,
    ...cabinets,
    ...buildings,
    ...timetable,
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

router.beforeEach((to, from, next) => {
    if (to.meta.private) {
        if (api.auth.user) {
            next();
        } else {
            next({name: 'Login'});
        }
    } else if (to.name === 'Login') {
        if (api.auth.user) {
            next('/');
        } else {
            next();
        }
    } else {
        next();
    }
})

export default router
