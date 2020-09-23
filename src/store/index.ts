import Vue from 'vue'
import Vuex from 'vuex'
import createEntitiesModule, {ModuleOverrides} from "@/store/entities";
import {EntityType} from "ggtu-timetable-api-client";
import {GET_ALL_ENTITIES} from "@/store/entities/action-types";
import {api} from "@/api";
import {SET_ALL_ENTITIES} from "@/store/entities/mutations-types";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },
  mutations: {
  },
  actions: {

  },
  modules: {
    groups: createEntitiesModule(EntityType.Group),
    teachers: createEntitiesModule(EntityType.Teacher),
    buildings: createEntitiesModule(EntityType.Building),
    cabinets: createEntitiesModule(EntityType.Cabinet, {
      actions: {
        [GET_ALL_ENTITIES](context) {
          return api.cabinets.getAll({entities: ['buildings']})
              .then(cabinets => context.commit(SET_ALL_ENTITIES, cabinets));
        }
      }
    } as ModuleOverrides),
    lessons: createEntitiesModule(EntityType.Lesson),
  }
})
