import { CreateLessonDto, CreatePatchDto } from 'ggtu-timetable-api-client';
import { UpdateLessonDto } from 'ggtu-timetable-api-client';
import { UpdatePatchDto } from 'ggtu-timetable-api-client';

export interface LessonHolder {
    getLesson(): CreateLessonDto | UpdateLessonDto | CreatePatchDto | UpdatePatchDto;
}
