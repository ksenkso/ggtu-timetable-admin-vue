import {NamedEntity} from "@/store/entities/types";
import {Cabinet} from "ggtu-timetable-api-client";

export interface SelectOption {
    name: string;
    value: any;
}

export const defaultEntityAdapter = (list: NamedEntity[]): SelectOption[] => {
    return list.map(entity => ({value: entity.id, name: entity.name}));
}

export const cabinetsAdapter = (cabinets: Cabinet[]) => {
    return cabinets.map(cabinet => ({value: cabinet.id, name: cabinet.building?.name + ' ' + cabinet.name}));
}
