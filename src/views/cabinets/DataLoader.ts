import {Store} from "vuex";
import {RootState} from "@/store/types";

export interface DataLoaderConstructor {
    new (store: Store<RootState>): DataLoader;
}
export interface DataLoader {

    load(): Promise<void> | void;
}
