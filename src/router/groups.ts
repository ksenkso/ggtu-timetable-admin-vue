import {RouteConfig} from "vue-router";

export default [
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
] as RouteConfig[];
