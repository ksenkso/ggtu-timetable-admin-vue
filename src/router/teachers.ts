import {RouteConfig} from "vue-router";

export default [
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
        name: 'TeacherUpdate',
        component: () => import(/* webpackChunkName: "teacherView" */'../views/TeacherView.vue'),
        meta: {
            private: true
        }
    },
] as RouteConfig[];
