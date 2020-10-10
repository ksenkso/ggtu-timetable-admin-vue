<template>
  <Card>
    <template slot="header">
      Пара {{ lesson.index + 1 }}
    </template>
    <div class="card__row">
      <p>
        {{ lesson.subject.name }}
        <br>
        {{ lesson.cabinet | cabinetName }}
      </p>
    </div>
    <div class="card__row">
      <p></p>
    </div>
    <div class="card__row">
      <ul class="list">
        <li class="list__item" v-for="teacher in lesson.teachers" :key="teacher.id">
          {{ teacher.name }}
        </li>
      </ul>
    </div>
    <template slot="footer">
      <router-link @click.native="edit" :to="{name: 'EditLesson', params: {id: lesson.id}}"
                   class="button button_theme-light">Редактировать
      </router-link>
      <Button @click.native="tryRemoveLesson" theme="danger">Удалить</Button>
    </template>
  </Card>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {Lesson} from "ggtu-timetable-api-client";
import Card from "@/components/common/Card.vue";
import {SET_LESSON_TO_UPDATE} from "@/store/editor/mutations-types";
import {namespace} from "vuex-class";

const editor = namespace('editor')

@Component({
  name: 'LessonView',
  components: {Card}
})
export default class LessonView extends Vue {
  @Prop({required: true}) lesson!: Lesson;
  @editor.Mutation(SET_LESSON_TO_UPDATE) setLesson!: (lesson: Lesson) => void;
  @editor.State('lessonToUpdate') toUpdate!: Lesson | null;

  edit() {
    console.log('move');
    this.setLesson(this.lesson)
    console.log(this.toUpdate);
  }

  tryRemoveLesson() {
    console.log('remove')
  }
}
</script>

<style lang="sass">
.card__footer
  display: flex
  justify-content: flex-end
  column-gap: 1rem
</style>
