import {TimetableEntryType, WithId} from "ggtu-timetable-api-client";

export interface NamedEntity {
    id?: number;
    name: string;
}

export type NamedEntityDict = Record<number, WithId<NamedEntity>>//{ [key: number]: WithId<NamedEntity> };

export interface EntitiesState {
    ids: number[];
    entities: NamedEntityDict;
    filter: string;
}

export interface TimetableEntryForm {
    id?: number;
    cabinetId: number;
    lessonId: number;
    teacherIds: number[];
    type: TimetableEntryType;
}
