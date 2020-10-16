import { ActionTree } from 'vuex';
import { EntitiesState, NamedEntity } from '@/store/entities/types';
import { RootState } from '@/store/types';
import { api } from '@/api';
import { CREATE_ENTITY, DELETE_ENTITY, GET_ALL_ENTITIES, UPDATE_ENTITY } from '@/store/entities/action-types';
import { ADD_ENTITY, REMOVE_ENTITY, SET_ALL_ENTITIES, SET_ENTITY } from '@/store/entities/mutations-types';
import { SET_LOADED } from '@/store/entities/mutations-types';
import { EntityType, WithId } from 'ggtu-timetable-api-client';


const createActions = (type: EntityType, overrides: ActionTree<EntitiesState, RootState> = {}): ActionTree<EntitiesState, RootState> => {
    return {
        [CREATE_ENTITY](context, entity: NamedEntity) {
            return api.getEndpoint(type).create(entity)
                .then(created => context.commit(ADD_ENTITY, created));
        },
        [GET_ALL_ENTITIES](context) {
            context.commit(SET_LOADED, false);
            return api.getEndpoint(type).getAll()
                .then(entities => context.commit(SET_ALL_ENTITIES, entities))
                .then(() => context.commit(SET_LOADED, true));
        },
        [UPDATE_ENTITY](context, entity: WithId<NamedEntity>) {
            return api.getEndpoint(type).update(entity.id, entity)
                .then(updated => context.commit(SET_ENTITY, entity.id, updated));
        },
        [DELETE_ENTITY](context, id: number) {
            return api.getEndpoint(type).delete(id)
                .then(() => context.commit(REMOVE_ENTITY, id));
        },
        ...overrides,
    }
}

export default createActions;
