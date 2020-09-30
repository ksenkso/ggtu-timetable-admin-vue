import { TimetableEntryType, WithId } from 'ggtu-timetable-api-client';

export interface NamedEntity {
    id?: number;
    name: string;
}

export type NamedEntityDict = Record<number | string, WithId<NamedEntity>>;

export interface EntitiesState {
    ids: number[];
    entities: NamedEntityDict;
    filter: string;
    isLoaded: boolean;
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
