import {ActionTree} from "vuex";
import {EntitiesState, NamedEntity} from "@/store/entities/types";
import {RootState} from "@/store/types";
import {api} from "@/api";
import {CREATE_ENTITY, DELETE_ENTITY, GET_ALL_ENTITIES, UPDATE_ENTITY} from "@/store/entities/action-types";
import {ADD_ENTITY, REMOVE_ENTITY, SET_ALL_ENTITIES, SET_ENTITY} from "@/store/entities/mutations-types";
import { EntityType, WithId } from 'ggtu-timetable-api-client';


const createActions = (type: EntityType): ActionTree<EntitiesState, RootState> => {
    return {
        [CREATE_ENTITY](context, entity: NamedEntity) {
            return api.getEntrypoint(type).create(entity)
                .then(created => context.commit(ADD_ENTITY, created));
        },
        [GET_ALL_ENTITIES](context) {
            return api.getEntrypoint(type).getAll()
                .then(entities => context.commit(SET_ALL_ENTITIES, entities));
        },
        [UPDATE_ENTITY](context, entity: WithId<NamedEntity>) {
            return api.getEntrypoint(type).update(entity.id, entity)
                .then(updated => context.commit(SET_ENTITY, entity.id, updated));
        },
        [DELETE_ENTITY](context, id: number) {
            return api.getEntrypoint(type).delete(id)
                .then(() => context.commit(REMOVE_ENTITY, id));
        }
    }
}

export default createActions;
