import {RouteConfig} from "vue-router";

export default [
    {
        path: '/buildings',
        name: 'Buildings',
        component: () => import(/* webpackChunkName: "buildings" */'../views/buildings/Buildings.vue'),
        meta: {
            private: true
        }
    },
    {
        path: '/buildings/create',
        name: 'BuildingCreate',
        component: () => import(/* webpackChunkName: "buildingView" */'../views/buildings/BuildingView.vue'),
        meta: {
            private: true
        }
    },
    {
        path: '/buildings/:id',
        name: 'BuildingView',
        component: () => import(/* webpackChunkName: "buildingView" */'../views/buildings/BuildingView.vue'),
        meta: {
            private: true
        }
    },
] as RouteConfig[];
