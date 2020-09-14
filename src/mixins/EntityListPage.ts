import {BindingHelpers} from "vuex-class/lib/bindings";
import {Component, Vue} from "vue-property-decorator";
import {DELETE_ENTITY} from "@/store/entities/action-types";
import {NamedEntityDict} from "@/store/entities/types";
import {SET_FILTER} from "@/store/entities/mutations-types";
import {VueClass} from "vue-class-component/lib/declarations";
import {DataLoader, DataLoaderConstructor} from "@/views/cabinets/DataLoader";

export interface ListPage {
    isEmpty: boolean;
    filteredEntities: NamedEntityDict;
    deleteCallback: (id: number) => Promise<void>;
    filterCallback: (filter: string) => void;
    dataLoader: DataLoader;
}

export default function entityListPage(context: BindingHelpers, DataLoader: DataLoaderConstructor): VueClass<ListPage> {
    @Component({
        name: 'EntityListPage',
    })
    class EntityListPage extends Vue {

        dataLoader: DataLoader = new DataLoader(this.$store);
        @context.Getter('isEmpty') isEmpty!: boolean;
        @context.Getter('filteredEntities') filteredEntities!: NamedEntityDict;
        @context.Action(DELETE_ENTITY) deleteCallback!: (id: number) => Promise<void>;
        @context.Mutation(SET_FILTER) filterCallback!: (filter: string) => void;

        mounted() {
            return this.dataLoader.startLoading();
        }
    }

    return EntityListPage;
}
