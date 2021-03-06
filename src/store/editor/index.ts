import {Day, Week} from 'ggtu-timetable-api-client';
import mutations from '@/store/editor/mutations';
import {Module} from 'vuex';
import {RootState} from '@/store/types';
import {EditorState} from '@/store/editor/types';
import actions from '@/store/editor/actions';

export default {
    namespaced: true,
    state: () => ({
        week: Week.Top,
        day: Day.Monday,
        group: null,
        lessonToUpdate: null,
        patchToUpdate: null,
        currentTimetable: {
            [Week.Top]: {},
            [Week.Bottom]: {},
        },
        patches: [],
        groupId: 0,
    }),
    mutations,
    actions,
    getters: {
        currentDay(state) {
            return state.currentTimetable[state.week][state.day];
        },
        nextIndex(state): number {
            return state.currentTimetable[state.week][state.day].length;
        }
    }
} as Module<EditorState, RootState>
