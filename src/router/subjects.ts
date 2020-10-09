import {RouteConfig} from "vue-router";

export default [
    {
        path: '/subjects',
        name: 'Subjects',
        component: () => import(/* webpackChunkName: "subjects" */'../views/subjects/Subjects.vue'),
        meta: {
            private: true
        }
    },
    {
        path: '/subjects/create',
        name: 'SubjectCreate',
        component: () => import(/* webpackChunkName: "subjectView" */'../views/subjects/SubjectView.vue'),
        meta: {
            private: true
        }
    },
    {
        path: '/subjects/:id',
        name: 'SubjectUpdate',
        component: () => import(/* webpackChunkName: "subjectView" */'../views/subjects/SubjectView.vue'),
        meta: {
            private: true
        }
    },
] as RouteConfig[];
