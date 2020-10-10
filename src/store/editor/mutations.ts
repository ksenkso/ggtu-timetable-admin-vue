import { MutationTree } from 'vuex';
import {
    ADD_LESSON,
    ADD_PATCH,
    SET_DAY,
    SET_GROUP_ID, SET_LESSON_TO_UPDATE,
    SET_LESSONS_FOR_WEEK, SET_PATCH, SET_PATCH_TO_UPDATE,
    SET_PATCHES_FOR_WEEK,
    SET_WEEK
} from '@/store/editor/mutations-types';
import { Day, Lesson, Patch, Week } from 'ggtu-timetable-api-client';
import { EditorState } from '@/store/editor/types';
import { v4 } from 'uuid';
import { REMOVE_PATCH } from '@/store/editor/action-types';
import { SET_GROUP } from '@/store/editor/mutations-types';
import { Group } from 'ggtu-timetable-api-client';

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
    [SET_LESSONS_FOR_WEEK](state, { lessons, week }: { lessons: Lesson[]; week: Week }) {
        // use strings as keys because Day values may change in the future and objects have string keys anyway
        const days: Record<string, { id: string; lesson?: Lesson }[]> = {
            [Day.Monday]: [],
            [Day.Tuesday]: [],
            [Day.Wednesday]: [],
            [Day.Thursday]: [],
            [Day.Friday]: [],
            [Day.Saturday]: [],
        };
        lessons.reduce((days, lesson) => {
            days[lesson.day].push({
                id: v4(),
                lesson,
            });
            return days;
        }, days);
        for (const dayIndex in days) {
            if (!Object.prototype.hasOwnProperty.call(days, dayIndex)) {
                continue;
            }
            const day = days[dayIndex];
            day.sort((a, b) => (a.lesson as Lesson).index - (b.lesson as Lesson).index);
            /**
             * The main idea: go through subjects, if lesson's index is not equal to expected lesson index,
             * then there is no lesson defined, so only set an id;
             * increment expected index every iteration, go to next lesson only if indices are equal.
             */
            let expectedSerialNumber = 0, lessonIndex = 0;
            while (lessonIndex < day.length) {
                // current lesson is not the lesson we are looking for, so there is no lesson for current index
                if ((day[lessonIndex].lesson as Lesson).index !== expectedSerialNumber) {
                    day.splice(expectedSerialNumber, 0, {id: v4()});
                } else {
                    lessonIndex++;
                }
                expectedSerialNumber++;
            }
        }
        state.currentTimetable[week] = days;
    },
    [SET_PATCHES_FOR_WEEK](state, patches: Patch[]) {
        state.patches = patches.map(patch => ({id: v4(), patch}));
    },
    [ADD_PATCH](state, patch: Patch) {
        state.patches.push({id: v4(), patch})
    },
    [ADD_LESSON](state, lesson: Lesson) {
        state.currentTimetable[lesson.week][lesson.day].splice(lesson.index, 0, {id: v4(), lesson});
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
