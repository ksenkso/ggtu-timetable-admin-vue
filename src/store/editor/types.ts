import {Day, Lesson, Patch, Week} from "ggtu-timetable-api-client";

export interface EditorState {
    week: Week;
    day: Day;
    groupId: number;
    currentTimetable: {
        [Week.Top]: Record<string, { id: string; lesson?: Lesson }[]>;
        [Week.Bottom]: Record<string, { id: string; lesson?: Lesson }[]>;
    };
    patches: {id: string; patch: Patch}[];
}
