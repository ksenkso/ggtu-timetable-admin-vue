import {EntitiesState, NamedEntity, NamedEntityDict} from "@/store/entities/types";
import {MutationTree} from "vuex";
import {WithId} from 'ggtu-timetable-api-client/dist/interfaces';
import {ADD_ENTITY, REMOVE_ENTITY, SET_ALL_ENTITIES, SET_ENTITY} from "@/store/entities/mutations-types";
import Vue from "vue";

const createMutations = (): MutationTree<EntitiesState> => {
    return {
        [ADD_ENTITY](state, entity: WithId<NamedEntity>) {
            Vue.set(state.entities, entity.id, entity)
            state.ids.push(entity.id);
        },
        [SET_ENTITY](state, entity: WithId<NamedEntity>) {
            Vue.set(state.entities, entity.id, entity)
        },
        [REMOVE_ENTITY](state, id: number) {
            Vue.delete(state.entities, id);
        },
        [SET_ALL_ENTITIES](state, entities: WithId<NamedEntity>[]) {
            state.entities = entities.reduce<NamedEntityDict>((acc, entity) => {
                acc[entity.id] = entity;
                return acc;
            }, {});
            state.ids = entities.map(entity => entity.id);
        }
    }
}
export default createMutations;
