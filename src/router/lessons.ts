import {RouteConfig} from "vue-router";

export default [
    {
        path: '/subjects',
        name: 'Lessons',
        component: () => import(/* webpackChunkName: "subjects" */'../views/lessons/Lessons.vue'),
        meta: {
            private: true
        }
    },
    {
        path: '/subjects/create',
        name: 'LessonCreate',
        component: () => import(/* webpackChunkName: "subjects" */'../views/lessons/LessonView.vue'),
        meta: {
            private: true
        }
    },
    {
        path: '/subjects/:id',
        name: 'LessonUpdate',
        component: () => import(/* webpackChunkName: "subjects" */'../views/lessons/LessonView.vue'),
        meta: {
            private: true
        }
    },
] as RouteConfig[];
