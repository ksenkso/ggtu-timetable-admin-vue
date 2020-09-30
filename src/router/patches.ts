import { RouteConfig } from 'vue-router';

export default [
    {
        path: '/patches/:groupId',
        name: 'PatchesForm',
        component: () => import(/* webpackChunkName: "patchesForm" */'../views/timetables/PatchesForm.vue'),
        meta: {
            private: true
        }
    },
] as RouteConfig[];
