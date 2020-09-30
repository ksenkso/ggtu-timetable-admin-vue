import {TimetableEntryType, WithId} from "ggtu-timetable-api-client";

export interface NamedEntity {
    id?: number;
    name: string;
}

export type NamedEntityDict = Record<number | string, WithId<NamedEntity>>//{ [key: number]: WithId<NamedEntity> };

export interface EntitiesState {
    ids: number[];
    entities: NamedEntityDict;
    filter: string;
}

export interface TimetableFormEmpty {
    id: number;
    type: TimetableEntryType;
    index: number;
}

export interface TimetableEntryForm {
    id: number;
    cabinetId: number;
    lessonId: number;
    teacherIds: number[];
    type: TimetableEntryType;
    index: number;
}
 export interface TimetablePatchForm extends TimetableEntryForm {
     dates: string[];
 }
