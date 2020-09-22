import {NamedEntity} from "@/store/entities/types";
import {SelectOption} from "@/components/forms/Select.vue";
import {Cabinet} from "ggtu-timetable-api-client";

export const defaultEntityAdapter = (list: NamedEntity[]): SelectOption[] => {
    return list.map(entity => ({value: entity.id, name: entity.name}));
}

export const cabinetsAdapter = (cabinets: Cabinet[]) => {
    return cabinets.map(cabinet => ({value: cabinet.id, name: cabinet.building?.name + ' ' + cabinet.name}));
}
