import {TimetableEntryForm} from "@/store/entities/types";
import { TimetableFormEmpty } from '@/store/entities/types';

export interface TimetableEntryView {
    getTimetableEntry(): TimetableEntryForm | TimetableFormEmpty;
}
