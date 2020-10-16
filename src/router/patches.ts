import { RouteConfig } from 'vue-router';

export default [
    {
        path: '/patches/:groupId',
        name: 'PatchesView',
        component: () => import(/* webpackChunkName: "patchesView" */'../views/timetables/PatchesView.vue'),
        meta: {
            private: true
        }
    },
    {
        name: 'EditPatch',
        path: '/patches/edit/:id',
        component: () => import(/* webpackChunkName: "patchesEdit" */'../views/timetables/EditPatch.vue'),
        meta: {
            private: true
        }
    },
    {
        name: 'AddPatchForGroup',
        path: '/patches/add/:groupId',
        component: () => import(/* webpackChunkName: "patchesCreate" */'../views/timetables/CreatePatch.vue'),
        meta: {
            private: true
        }
    }
] as RouteConfig[];
