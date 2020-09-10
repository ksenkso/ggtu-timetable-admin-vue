export interface NamedEntity {
    name: string;
}

export type NamedEntityDict = { [key: number]: NamedEntity };

export interface EntitiesState {
    ids: number[];
    entities: NamedEntityDict;
}
