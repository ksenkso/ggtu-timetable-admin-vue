import { LessonType, WithId } from 'ggtu-timetable-api-client';

export interface NamedEntity {
    id?: number;
    name: string;
}

export type NamedEntityDict = Record<number | string, WithId<NamedEntity>>;
export type EntityListFilter = (id: number, index?: number, ids?: number[]) => boolean;
export interface EntitiesState {
    ids: number[];
    entities: NamedEntityDict;
    filterValue: string;
    isLoaded: boolean;
    filter: EntityListFilter;
}

export interface EmptyLesson {
    id: number;
    type: LessonType;
    index: number;
}

export interface LessonForm {
    id: number;
    cabinetId: number;
    subjectId: number;
    teacherIds: number[];
    type: LessonType;
    index: number;
}

export interface PatchForm extends LessonForm {
    dates: string[];
}
