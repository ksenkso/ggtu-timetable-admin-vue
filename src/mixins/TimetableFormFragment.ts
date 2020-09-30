import { Component, Prop, Ref, Vue } from 'vue-property-decorator';
import { Cabinet } from 'ggtu-timetable-api-client';
import { TimetablePatch } from 'ggtu-timetable-api-client';
import { TimetablePatchDTO } from 'ggtu-timetable-api-client';
import { TimetableEntryDTO } from 'ggtu-timetable-api-client';
import { TimetableEntry } from 'ggtu-timetable-api-client';
import Form from '../components/forms/Form.vue';
import Field from '../components/forms/Field.vue';
import Select from '../components/forms/Select.vue';
import ListBox from '@/components/forms/ListBox.vue';
import { cabinetsAdapter, defaultEntityAdapter, SelectOption } from '@/utils/lists';
import DayPicker from '@/components/timetable/DayPicker.vue';
import Button from '@/components/common/Button.vue';
import WeekPicker from '@/components/timetable/WeekPicker.vue';
import { NamedEntity, NamedEntityDict } from '@/store/entities/types';
import { namespace } from 'vuex-class';
import { Dictionary } from 'vue-router/types/router';
import { GET_ALL_ENTITIES } from '@/store/entities/action-types';

const cabinets = namespace('cabinets');
const teachers = namespace('teachers');
const lessons = namespace('lessons');

@Component({
    name: 'TimetableFormFragment',
    components: { Form, Field, Select, ListBox, DayPicker, WeekPicker, Button }
})
export default class TimetableFormFragment<C extends TimetableEntry | TimetablePatch, DTO extends TimetableEntryDTO | TimetablePatchDTO> extends Vue {

    @Prop({ required: true }) entry!: C | DTO;
    @cabinets.Action(GET_ALL_ENTITIES) getCabinets!: () => Promise<void>;
    @teachers.Action(GET_ALL_ENTITIES) getTeachers!: () => Promise<void>;
    @lessons.Action(GET_ALL_ENTITIES) getLessons!: () => Promise<void>;
    @cabinets.State('entities') cabinets!: Dictionary<Cabinet>;
    @teachers.State('entities') teachers!: NamedEntityDict;
    @lessons.State('entities') lessons!: NamedEntityDict;
    @cabinets.State('isLoaded') cabinetsLoaded!: boolean;
    @teachers.State('isLoaded') teachersLoaded!: boolean;
    @lessons.State('isLoaded') lessonsLoaded!: boolean;

    get optionsLoaded(): boolean {
        return this.cabinetsLoaded && this.teachersLoaded && this.lessonsLoaded;
    }

    @Ref() form!: Form;
    data: DTO | null = null;
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


    mounted() {
        this.data = this.createEntryDto(this.entry);
        this.teachersCount = Math.max(this.data.teacherIds.length, 1);
        let loadEntities: Promise<any>;
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

    protected createEntryDto(entry: C | DTO): DTO {
        const teacherIds = (this.entry as C).teachers
            ? (this.entry as C).teachers.map(teacher => teacher.id as number)
            : (this.entry as DTO).teacherIds;
        return {
            cabinetId: entry.cabinetId,
            groupId: entry.groupId,
            index: entry.index,
            lessonId: entry.lessonId,
            teacherIds,
            type: entry.type,
        } as unknown as DTO;
    }
}
