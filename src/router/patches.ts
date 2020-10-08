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
    {
        name: 'EditPatch',
        path: '/patches/edit/:id',
        component: () => import(/* webpackChunkName: "patchesForm" */'../views/timetables/PatchesForm.vue'),
        meta: {
            private: true
        }
    },
    {
        name: 'AddPatchForGroup',
        path: '/patches/add/:groupId',
        component: () => import(/* webpackChunkName: "patchesForm" */'../views/timetables/PatchesForm.vue'),
        meta: {
            private: true
        }
    }
] as RouteConfig[];
