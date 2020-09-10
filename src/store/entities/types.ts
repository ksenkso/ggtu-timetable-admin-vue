import {WithId} from "ggtu-timetable-api-client";

export interface NamedEntity {
    name: string;
}

export type NamedEntityDict = { [key: number]: WithId<NamedEntity> };

export interface EntitiesState {
    ids: number[];
    entities: NamedEntityDict;
    filter: string;
}
