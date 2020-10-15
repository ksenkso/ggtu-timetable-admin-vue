<template>
  <Card
      :theme="!lesson && 'warning'"
      :class="[
      'day__lesson',
      { day__lesson_patch: this.lesson && !this.lesson.isRegular }
    ]"
  >
    <template slot="header">
      Пара {{ index + 1 }}
    </template>
    <template v-if="lesson">
      <div class="card__row">
        <p>
          {{ lesson.subject.name }}
          <br/>
          {{ lesson.type | lessonType }}
          <br/>
          {{ lesson.cabinet | cabinetName }}
        </p>
      </div>
      <div class="card__row">
        <ul class="list">
          <li
              class="list__item"
              v-for="teacher in lesson.teachers"
              :key="teacher.id"
          >
            {{ teacher.name }}
          </li>
        </ul>
      </div>
    </template>
    <template v-else>
      Нет пары
    </template>
    <template slot="footer">
      <Button @click.native="edit" theme="light">Редактировать</Button>
      <Button v-if="canRemove" @click.native="tryRemoveLesson" theme="danger">Удалить</Button>
    </template>
  </Card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Lesson } from 'ggtu-timetable-api-client';
import Card from '@/components/common/Card.vue';
import { SET_LESSON_TO_UPDATE } from '@/store/editor/mutations-types';
import { namespace } from 'vuex-class';
import { REMOVE_LESSON } from '@/store/editor/action-types';
import { REMOVE_LESSON_BY_INDEX } from '@/store/editor/mutations-types';
import { CREATE_EMPTY_LESSON } from '@/store/editor/action-types';
import { KeyedObject } from '@/store/editor/types';
import { SET_LESSON } from '@/store/editor/mutations-types';

const editor = namespace('editor')

@Component({
  name: 'LessonView',
  components: { Card }
})
export default class LessonView extends Vue {
  @Prop({ required: true }) lesson!: Lesson;
  @Prop({ required: true }) index!: number;
  @editor.Mutation(SET_LESSON) setLesson!: (lesson: Lesson) => void;
  @editor.Mutation(SET_LESSON_TO_UPDATE) setLessonToUpdate!: (lesson: Lesson) => void;
  @editor.Mutation(REMOVE_LESSON_BY_INDEX) removeLessonByIndex!: (index: number) => void;
  @editor.Action(REMOVE_LESSON) removeLesson!: (lesson: Lesson) => Promise<void>;
  @editor.Action(CREATE_EMPTY_LESSON) createLesson!: (lesson: Partial<Lesson>) => KeyedObject<'lesson', Lesson>;
  @editor.State('lessonToUpdate') toUpdate!: Lesson | null;
  @editor.Getter('nextIndex') nextIndex!: number;

  get canRemove() {
    return this.lesson || this.index === this.nextIndex - 1;
  }

  async edit() {
    if (this.lesson) {
      this.setLessonToUpdate(this.lesson)
    } else {
      const entry = await this.createLesson({ index: this.index });
      console.log(entry)
      this.setLesson(entry.lesson);
      this.setLessonToUpdate(entry.lesson);
    }
  }

  tryRemoveLesson() {
    const shouldRemove = confirm(`Удалить пару ${this.index + 1}?`);
    if (shouldRemove) {
      if (this.lesson) {
        this.removeLesson(this.lesson);
      } else {
        this.removeLessonByIndex(this.index);
      }

    }
  }
}
</script>

<style lang="sass">
.card__footer
  display: flex
  justify-content: flex-end
  column-gap: 1rem
</style>
