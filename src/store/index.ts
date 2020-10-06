import Vue from 'vue'
import Vuex from 'vuex'
import createEntitiesModule from "@/store/entities";
import {EntityType} from "ggtu-timetable-api-client";
import editor from './editor';

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
    cabinets: createEntitiesModule(EntityType.Cabinet),
    subjects: createEntitiesModule(EntityType.Subject),
    editor
  }
})
