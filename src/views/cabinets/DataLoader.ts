import {Store} from "vuex";
import {RootState} from "@/store/types";

export interface DataLoaderConstructor {
    new(store: Store<RootState>, ...args: any[]): DataLoader;
}

export interface DataLoader {
    loaded: boolean;
    isLoading: boolean;

    load(): Promise<void> | void;

    startLoading(): Promise<void>;
}

export abstract class AbstractDataLoader implements DataLoader {
    protected constructor(protected store: Store<RootState>) {
    }

    loaded = false;
    isLoading = false;

    abstract load(): Promise<void> | void;

    async startLoading(): Promise<void> {
        this.isLoading = true;
        await this.load();
        this.isLoading = false;
        this.loaded = true;
    }
}
