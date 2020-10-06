import {MutationTree} from "vuex";
import {SET_DAY, SET_GROUP_ID, SET_WEEK} from "@/store/editor/mutations-types";
import {Day, Week} from "ggtu-timetable-api-client";
import {EditorState} from "@/store/editor/types";

export default {
    [SET_WEEK](state, week: Week) {
        state.week = week;
    },
    [SET_DAY](state, day: Day) {
        state.day = day;
    },
    [SET_GROUP_ID](state, groupId: number) {
        state.groupId = groupId;
    },
} as MutationTree<EditorState>
