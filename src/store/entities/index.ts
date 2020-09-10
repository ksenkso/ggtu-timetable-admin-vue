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
        ids: []
    }),
    mutations: createMutations(),
    actions: createActions(type),
});

export default createEntitiesModule;
