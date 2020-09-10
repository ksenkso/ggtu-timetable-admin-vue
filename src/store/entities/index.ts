import createMutations from './mutations';
import createActions from './actions';
import {Module} from "vuex";
import {EntitiesState, NamedEntityDict} from "@/store/entities/types";
import {RootState} from "@/store/types";
import {EntityType} from "ggtu-timetable-api-client";

const createEntitiesModule = (type: EntityType): Module<EntitiesState, RootState> => ({
    namespaced: true,
    state: () => ({
        entities: {},
        ids: [],
        filter: '',
    }),
    mutations: createMutations(),
    actions: createActions(type),
    getters: {
        filteredEntities(state): NamedEntityDict {
            return state.filter
                ? state.ids
                    .filter(id => state.entities[id].name.toLowerCase().includes(state.filter))
                    .reduce<NamedEntityDict>((acc, id) => {
                        acc[id] = state.entities[id];
                        return acc;
                    }, {})
                : state.entities;
        },
        isEmpty(state, getters): boolean {
            return !Object.keys(getters.filteredEntities).length;
        }
    }
});

export default createEntitiesModule;
