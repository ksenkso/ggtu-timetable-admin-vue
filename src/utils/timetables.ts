import {TimetableEntryForm, TimetableFormEmpty} from "@/store/entities/types";

export interface TimetableEntryView {
    getTimetableEntry(): TimetableEntryForm | TimetableFormEmpty;
}
