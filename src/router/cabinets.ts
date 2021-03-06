import {RouteConfig} from "vue-router";

export default [
    {
        path: '/cabinets',
        name: 'Cabinets',
        component: () => import(/* webpackChunkName: "cabinets" */'../views/cabinets/Cabinets.vue'),
        meta: {
            private: true
        }
    },
    {
        path: '/cabinets/create',
        name: 'CabinetCreate',
        component: () => import(/* webpackChunkName: "groupView" */'../views/cabinets/CabinetView.vue'),
        meta: {
            private: true
        }
    },
    {
        path: '/cabinets/:id',
        name: 'CabinetView',
        component: () => import(/* webpackChunkName: "groupView" */'../views/cabinets/CabinetView.vue'),
        meta: {
            private: true
        }
    },
] as RouteConfig[];
