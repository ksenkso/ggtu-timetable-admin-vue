import {RouteConfig} from 'vue-router';

export default [
    {
        path: '/timetable/:groupId/edit',
        name: 'TimetableForm',
        component: () => import(/* webpackChunkName: "lessonsView" */'../views/timetables/Timetable.vue'),
        meta: {
            private: true
        }
    }
] as RouteConfig[];
