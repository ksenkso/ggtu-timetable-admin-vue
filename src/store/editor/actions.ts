import { ActionTree } from 'vuex';
import { EditorState } from '@/store/editor/types';
import { RootState } from '@/store/types';
import {
    ADD_LESSON,
    ADD_PATCH,
    GET_GROUP,
    GET_LESSONS_FOR_WEEK,
    GET_PATCHES, LOAD_LESSON, LOAD_PATCH,
    REMOVE_LESSON,
    REMOVE_PATCH,
    UPDATE_LESSON,
    UPDATE_PATCH
} from '@/store/editor/action-types';
import { api } from '@/api';
import {
    SET_GROUP,
    SET_GROUP_ID,
    SET_LESSON, SET_LESSON_TO_UPDATE,
    SET_LESSONS_FOR_WEEK,
    SET_PATCH, SET_PATCH_TO_UPDATE,
    SET_PATCHES_FOR_WEEK
} from '@/store/editor/mutations-types';
import { CreateLessonDto, CreatePatchDto, UpdateLessonDto, UpdatePatchDto, Week } from 'ggtu-timetable-api-client';

export default {
    [GET_GROUP](context, groupId: number) {
        context.commit(SET_GROUP_ID, groupId);
        return api.groups.get(groupId)
            .then(group => {
                context.commit(SET_GROUP, group);
            });
    },
    [GET_LESSONS_FOR_WEEK](context, { groupId, week }: { groupId: number; week: Week }) {
        return api.timetable.getForGroupByWeek(groupId, week)
            .then(lessons => {
                context.commit(SET_LESSONS_FOR_WEEK, { lessons, week });
            });
    },
    [ADD_LESSON](context, lesson: CreateLessonDto) {
        return api.timetable.create(lesson)
            .then(created => {
                context.commit(ADD_LESSON, created);
            });
    },
    [REMOVE_LESSON](context, lessonId: number) {
        return api.timetable.delete(lessonId)
            .then(() => {
                context.commit(REMOVE_LESSON, lessonId);
            });
    },
    [UPDATE_LESSON](context, lesson: UpdateLessonDto) {
        return api.timetable.update(lesson.id as number, lesson)
            .then(updated => {
                context.commit(SET_LESSON, updated);
            });
    },
    [GET_PATCHES](context, groupId: number) {
        return api.patches.getForGroup(groupId)
            .then(patches => {
                context.commit(SET_PATCHES_FOR_WEEK, patches);
            });
    },
    [ADD_PATCH](context, patch: CreatePatchDto) {
        return api.patches.create(patch)
            .then(created => {
                context.commit(ADD_PATCH, created);
            });
    },
    [REMOVE_PATCH](context, patchId: number) {
        return api.patches.delete(patchId)
            .then(() => {
                context.commit(REMOVE_PATCH, patchId);
            });
    },
    [UPDATE_PATCH](context, patch: UpdatePatchDto) {
        return api.patches.update(patch.id as number, patch)
            .then(updated => {
                context.commit(SET_PATCH, updated);
            });
    },
    [LOAD_PATCH](context, patchId: number) {
        return api.patches.get(patchId)
            .then(patch => {
                context.commit(SET_PATCH_TO_UPDATE, patch)
            })
    },
    [LOAD_LESSON](context, lessonId: number) {
        return api.patches.get(lessonId)
            .then(lesson => {
                context.commit(SET_LESSON_TO_UPDATE, lesson)
            })
    }
} as ActionTree<EditorState, RootState>
