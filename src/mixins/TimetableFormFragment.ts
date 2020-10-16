import {Component, Prop, Ref, Vue} from 'vue-property-decorator';
import {Cabinet, Lesson, Patch, UpdateLessonDto, UpdatePatchDto} from 'ggtu-timetable-api-client';
import Form from '../components/forms/Form.vue';
import Field from '../components/forms/Field.vue';
import Select from '../components/forms/Select.vue';
import ListBox from '@/components/forms/ListBox.vue';
import {cabinetsAdapter, defaultEntityAdapter, SelectOption} from '@/utils/lists';
import DayPicker from '@/components/timetable/DayPicker.vue';
import Button from '@/components/common/Button.vue';
import WeekPicker from '@/components/timetable/WeekPicker.vue';
import {NamedEntity, NamedEntityDict} from '@/store/entities/types';
import {namespace} from 'vuex-class';
import {Dictionary} from 'vue-router/types/router';
import {GET_ALL_ENTITIES} from '@/store/entities/action-types';

const cabinets = namespace('cabinets');
const teachers = namespace('teachers');
const lessons = namespace('subjects');

@Component({
    name: 'TimetableFormFragment',
    components: { Form, Field, Select, ListBox, DayPicker, WeekPicker, Button }
})
export default class TimetableFormFragment<T extends (Lesson | Patch), U extends (UpdateLessonDto | UpdatePatchDto)> extends Vue {

    @Prop() lesson?: T;
    @cabinets.Action(GET_ALL_ENTITIES) getCabinets!: () => Promise<void>;
    @teachers.Action(GET_ALL_ENTITIES) getTeachers!: () => Promise<void>;
    @lessons.Action(GET_ALL_ENTITIES) getLessons!: () => Promise<void>;
    @cabinets.State('entities') cabinets!: Dictionary<Cabinet>;
    @teachers.State('entities') teachers!: NamedEntityDict;
    @lessons.State('entities') lessons!: NamedEntityDict;
    @cabinets.State('isLoaded') cabinetsLoaded!: boolean;
    @teachers.State('isLoaded') teachersLoaded!: boolean;
    @lessons.State('isLoaded') lessonsLoaded!: boolean;
    isReady = false;

    get optionsLoaded(): boolean {
        return this.cabinetsLoaded && this.teachersLoaded && this.lessonsLoaded;
    }

    @Ref() form!: Form;
    data: U = {} as U;
    lessonsOptions: SelectOption[] = [];
    teachersOptions: SelectOption[] = [];
    cabinetsOptions: SelectOption[] = [];
    entryTypes: SelectOption[] = [
        { value: 0, name: 'Лекция' },
        { value: 1, name: 'Практическое занятие' },
        { value: 2, name: 'Лабораторная работа' },
    ];
    teachersCount = 1;
    teacherIds?: number[] | null = null;

    addTeacherField() {
        this.teachersCount++;
    }

    getLesson() {
        throw new Error('getLesson() should be defined in a subclass');
    }

    saveLesson() {
        const lesson = this.getLesson();
        this.$emit('submit', lesson);
    }

    mounted() {
        this.data = this.createEntryDto(this.lesson);
        this.isReady = true;
        this.teachersCount = Math.max((this.data.teacherIds as number[]).length, 1);
        let loadEntities: Promise<unknown>;
        if (!this.optionsLoaded) {
            loadEntities = Promise.all([
                this.getCabinets(),
                this.getLessons(),
                this.getTeachers()
            ]);
        } else {
            loadEntities = Promise.resolve();
        }
        loadEntities.then(() => {
            this.lessonsOptions = defaultEntityAdapter(Object.keys(this.lessons)
                .map((id) => this.lessons[id] as NamedEntity));
            this.teachersOptions = defaultEntityAdapter(Object.keys(this.teachers)
                .map((id) => this.teachers[id] as NamedEntity));
            this.cabinetsOptions = cabinetsAdapter(Object.keys(this.cabinets)
                .map((id) => this.cabinets[id] as Cabinet));
        })

    }

    protected createEntryDto(entry: T = {} as T): U {
        return {
            cabinetId: entry.cabinetId,
            groupId: entry.groupId,
            index: entry.index,
            subjectId: entry.subjectId,
            teacherIds: entry.teachers.map(teacher => teacher.id),
            type: entry.type,
            id: entry.id
        } as unknown as U;
    }
}
