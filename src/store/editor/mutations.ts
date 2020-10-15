import { MutationTree } from 'vuex';
import {
    ADD_LESSON,
    ADD_PATCH,
    REMOVE_LESSON,
    SET_DAY,
    SET_GROUP,
    SET_GROUP_ID,
    SET_LESSON,
    SET_LESSON_TO_UPDATE,
    SET_LESSONS_FOR_WEEK,
    SET_PATCH,
    SET_PATCH_TO_UPDATE,
    SET_PATCHES_FOR_WEEK,
    SET_WEEK
} from '@/store/editor/mutations-types';
import { Day, Group, Lesson, Patch, Week } from 'ggtu-timetable-api-client';
import { EditorState, TimetableWeek } from '@/store/editor/types';
import { v4 } from 'uuid';
import { REMOVE_PATCH } from '@/store/editor/action-types';
import { SET_WINDOW } from '@/store/editor/mutations-types';
import { REMOVE_LESSON_BY_INDEX } from '@/store/editor/mutations-types';

function removeLesson(state: EditorState, index: number) {
    if (index !== -1) {
        if (index === state.currentTimetable[state.week][state.day].length - 1) {
            state.currentTimetable[state.week][state.day].pop();
        } else {
            state.currentTimetable[state.week][state.day].splice(index, 1, { id: v4() });
        }
    }
}

export default {
    [SET_GROUP](state, group: Group) {
        state.group = group;
    },
    [SET_WEEK](state, week: Week) {
        state.week = week;
    },
    [SET_DAY](state, day: Day) {
        state.day = day;
    },
    [SET_GROUP_ID](state, groupId: number) {
        state.groupId = groupId;
    },
    [SET_LESSONS_FOR_WEEK](state, { lessons, week }: { lessons: Record<string, (Lesson | null)[]>; week: Week }) {

        state.currentTimetable[week] = Object.keys(lessons)
            .reduce<TimetableWeek>((acc, day) => {
                acc[day] = lessons[day].map((lesson) => ({ id: v4(), lesson }));
                return acc;
            }, {});
    },
    [SET_PATCHES_FOR_WEEK](state, patches: Patch[]) {
        state.patches = patches.map(patch => ({ id: v4(), patch }));
    },
    [ADD_PATCH](state, patch: Patch) {
        state.patches.push({ id: v4(), patch })
    },
    [ADD_LESSON](state, lesson: Lesson) {
        state.currentTimetable[lesson.week][lesson.day].splice(lesson.index, 0, { id: v4(), lesson });
    },
    [SET_LESSON](state, lesson: Lesson) {
        const day = state.currentTimetable[lesson.week][lesson.day];
        if (day[lesson.index]) {
            day[lesson.index].lesson = lesson
        } else {
            day[lesson.index] = { id: v4(), lesson };
        }
    },
    [SET_WINDOW](state, { day, week, index }: { day: Day; week: Week; index: number }) {
        const lessons = state.currentTimetable[week][day];
        if (lessons[index]) {
            lessons[index].lesson = null;
        } else {
            lessons[index] = { id: v4(), lesson: null };
        }
    },
    [REMOVE_LESSON](state, lesson: Lesson) {
        const day = state.currentTimetable[lesson.week][lesson.day];
        const index = day.findIndex(l => l.lesson && l.lesson.id === lesson.id && l.lesson.index === lesson.index);
        removeLesson(state, index);
    },
    [REMOVE_LESSON_BY_INDEX](state, index: number) {
        removeLesson(state, index);
    },
    [REMOVE_PATCH](state, patchId: number) {
        const index = state.patches.findIndex(entry => entry.patch.id === patchId);
        if (index !== -1) {
            state.patches.splice(index, 1);
        }
    },
    [SET_PATCH](state, patch: Patch) {
        const index = state.patches.findIndex(entry => entry.patch.id === patch.id);
        if (index !== -1) {
            state.patches[index].patch = patch
        }
    },
    [SET_PATCH_TO_UPDATE](state, patch: Patch) {
        state.patchToUpdate = patch;
    },
    [SET_LESSON_TO_UPDATE](state, lesson: Lesson) {
        state.lessonToUpdate = lesson;
    }
} as MutationTree<EditorState>
