import {Day, Week} from "ggtu-timetable-api-client";
import mutations from "@/store/editor/mutations";
import {Module} from "vuex";
import {RootState} from "@/store/types";
import {EditorState} from "@/store/editor/types";

export default {
    namespaced: true,
    state: () => ({
        week: Week.Top,
        day: Day.Monday
    }),
    mutations
} as Module<EditorState, RootState>
