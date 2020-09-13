import {RouteConfig} from "vue-router";

export default [
    {
        path: '/lessons',
        name: 'Lessons',
        component: () => import(/* webpackChunkName: "lessons" */'../views/lessons/Lessons.vue'),
        meta: {
            private: true
        }
    },
    {
        path: '/lessons/create',
        name: 'LessonCreate',
        component: () => import(/* webpackChunkName: "lessons" */'../views/lessons/LessonView.vue'),
        meta: {
            private: true
        }
    },
    {
        path: '/lessons/:id',
        name: 'LessonUpdate',
        component: () => import(/* webpackChunkName: "lessons" */'../views/lessons/LessonView.vue'),
        meta: {
            private: true
        }
    },
] as RouteConfig[];
