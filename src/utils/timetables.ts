import {CreateLessonDto, CreatePatchDto} from "ggtu-timetable-api-client";

export interface LessonHolder {
    getLesson(): CreateLessonDto | CreatePatchDto;
}
