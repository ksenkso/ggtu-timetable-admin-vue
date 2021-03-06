import {Day, Group, Lesson, Patch, Week} from 'ggtu-timetable-api-client';

export type KeyedObjectMaybe<K extends string, V> = { [key in K]?: V } & { id: string }
export type KeyedObject<K extends string, V> = { [key in K]: V } & { id: string };
export type TimetableWeek = Record<string, KeyedObjectMaybe<'lesson', Lesson | null>[]>;
export interface TimetableState {
    [Week.Top]: TimetableWeek;
    [Week.Bottom]: TimetableWeek;
}

export interface EditorState {
    week: Week;
    day: Day;
    groupId: number;
    group: Group | null;
    currentTimetable: TimetableState;
    patches: { id: string; patch: Patch }[];
    // maybe we can union these two fields
    patchToUpdate: Patch | null;
    lessonToUpdate: Lesson | null;
}
