import {Day, Week} from "ggtu-timetable-api-client";

export interface EditorState {
    week: Week;
    day: Day;
    groupId: number;
}
