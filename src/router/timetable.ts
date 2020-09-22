import {RouteConfig} from "vue-router";

export default [
    {
        path: '/timetable/:groupId/edit',
        name: 'TimetableForm',
        component: () => import(/* webpackChunkName: "timetableForm" */'../views/timetables/TimetableForm.vue'),
        meta: {
            private: true
        }
    },
    {
        path: '/timetable/:groupId',
        name: 'TimetableForGroup',
        component: () => import(/* webpackChunkName: "timetableForGroup" */'../views/timetables/RegularTimetable.vue'),
        meta: {
            private: true
        }
    },
] as RouteConfig[];
