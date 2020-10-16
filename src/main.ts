import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import Alert from "@/components/common/Alert.vue";
import Button from "@/components/common/Button.vue";
import {Cabinet, LessonType} from "ggtu-timetable-api-client";

Vue.config.productionTip = false
Vue.component('Alert', Alert);
Vue.component('Button', Button);
Vue.filter('lessonType', (type: LessonType) => {
  switch (type) {
    case LessonType.Empty: return 'Нет пары';
    case LessonType.Lab: return 'Лабораторное занятие';
    case LessonType.Lecture: return 'Лекция';
    case LessonType.Practice: return 'Практическое занятие';
    default: return 'Занятие';
  }
})
Vue.filter('cabinetName', (cabinet: Cabinet) => {
  return cabinet.building
      ? cabinet.building.name + ', ' + cabinet.name
      : cabinet.name;
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
