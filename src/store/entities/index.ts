import createMutations from './mutations';
import createActions from './actions';
import {ActionTree, GetterTree, Module} from "vuex";
import {EntitiesState, NamedEntityDict} from "@/store/entities/types";
import {RootState} from "@/store/types";
import {EntityType} from "ggtu-timetable-api-client";
export interface ModuleOverrides {
    actions?: ActionTree<EntitiesState, RootState>;
    getters?: GetterTree<EntitiesState, RootState>;
}
const createEntitiesModule = (type: EntityType, overrides: ModuleOverrides = {}): Module<EntitiesState, RootState> => ({
    namespaced: true,
    state: () => ({
        entities: {},
        ids: [],
        filter: '',
        isLoaded: false,
    }),
    mutations: createMutations(),
    actions: createActions(type, overrides.actions),
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
        },
        ...overrides.getters,
    }
});

export default createEntitiesModule;
