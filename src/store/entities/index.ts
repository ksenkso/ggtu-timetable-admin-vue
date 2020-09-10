import createMutations from './mutations';
import createActions from './actions';
import {Module} from "vuex";
import {EntitiesState} from "@/store/entities/types";
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
        filteredEntities(state) {
            return state.filter
                ? state.ids
                    .filter(id => state.entities[id].name.toLowerCase().includes(state.filter))
                    .map(id => state.entities[id])
                : state.entities;
        }
    }
});

export default createEntitiesModule;
