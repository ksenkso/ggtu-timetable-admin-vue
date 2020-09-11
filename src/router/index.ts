import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import {api} from "@/api";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'Home',
        redirect: '/groups'
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
        meta: {
            private: true
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    },
    {
        path: '/groups',
        name: 'Groups',
        component: () => import(/* webpackChunkName: "groups" */'../views/Groups.vue'),
        meta: {
            private: true
        }
    },
    {
        path: '/groups/create',
        name: 'GroupCreate',
        component: () => import(/* webpackChunkName: "groupView" */'../views/GroupView.vue'),
        meta: {
            private: true
        }
    },
    {
        path: '/groups/:id',
        name: 'GroupView',
        component: () => import(/* webpackChunkName: "groupView" */'../views/GroupView.vue'),
        meta: {
            private: true
        }
    },
    {
        path: '/teachers',
        name: 'Teachers',
        component: () => import(/* webpackChunkName: "teachers" */'../views/Teachers.vue'),
        meta: {
            private: true
        }
    },
    {
        path: '/teachers/create',
        name: 'TeacherCreate',
        component: () => import(/* webpackChunkName: "teacherView" */'../views/TeacherView.vue'),
        meta: {
            private: true
        }
    },
    {
        path: '/teachers/:id',
        name: 'TeacherView',
        component: () => import(/* webpackChunkName: "teacherView" */'../views/TeacherView.vue'),
        meta: {
            private: true
        }
    },
    {
        path: '/lessons',
        name: 'Lessons',
        component: () => import(/* webpackChunkName: "lessons" */'../views/Lessons.vue'),
        meta: {
            private: true
        }
    },
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
