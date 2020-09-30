import {EntitiesState, NamedEntity, NamedEntityDict} from "@/store/entities/types";
import {MutationTree} from "vuex";
import {WithId} from 'ggtu-timetable-api-client/dist/interfaces';
import {ADD_ENTITY, REMOVE_ENTITY, SET_ALL_ENTITIES, SET_ENTITY, SET_FILTER} from "@/store/entities/mutations-types";
import Vue from "vue";
import { SET_LOADED } from '@/store/entities/mutations-types';

const createMutations = (): MutationTree<EntitiesState> => {
    return {
        [ADD_ENTITY](state, entity: WithId<NamedEntity>) {
            Vue.set(state.entities, entity.id, entity)
            state.ids.push(entity.id);
        },
        [SET_ENTITY](state, entity: WithId<NamedEntity>) {
            Vue.set(state.entities, entity.id, entity)
        },
        [REMOVE_ENTITY](state, entityId: number) {
            state.ids = state.ids.filter(id => id !== entityId);
            Vue.delete(state.entities, entityId);
        },
        [SET_ALL_ENTITIES](state, entities: WithId<NamedEntity>[]) {
            state.entities = entities.reduce<NamedEntityDict>((acc, entity) => {
                acc[entity.id] = entity;
                return acc;
            }, {});
            state.ids = entities.map(entity => entity.id);
        },
        [SET_FILTER](state, filter) {
            state.filter = filter;
        },
        [SET_LOADED](state, isLoaded) {
            state.isLoaded = isLoaded;
        }
    }
}
export default createMutations;
