import {LessonForm} from "@/store/entities/types";
import { EmptyLesson } from '@/store/entities/types';

export interface LessonHolder<T> {
    getLesson(): LessonForm | EmptyLesson;
}
