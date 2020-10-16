import {RouteConfig} from "vue-router";

export default [
    {
        path: '/teachers',
        name: 'Teachers',
        component: () => import(/* webpackChunkName: "teachers" */'../views/teachers/Teachers.vue'),
        meta: {
            private: true
        }
    },
    {
        path: '/teachers/create',
        name: 'TeacherCreate',
        component: () => import(/* webpackChunkName: "teacherView" */'../views/teachers/TeacherView.vue'),
        meta: {
            private: true
        }
    },
    {
        path: '/teachers/:id',
        name: 'TeacherUpdate',
        component: () => import(/* webpackChunkName: "teacherView" */'../views/teachers/TeacherView.vue'),
        meta: {
            private: true
        }
    },
] as RouteConfig[];
