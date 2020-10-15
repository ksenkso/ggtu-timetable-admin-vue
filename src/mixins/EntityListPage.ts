import { BindingHelpers } from 'vuex-class/lib/bindings';
import { Component, Vue } from 'vue-property-decorator';
import { DELETE_ENTITY } from '@/store/entities/action-types';
import { NamedEntityDict } from '@/store/entities/types';
import { SET_FILTER_VALUE } from '@/store/entities/mutations-types';
import { VueClass } from 'vue-class-component/lib/declarations';
import { DataLoader, DataLoaderConstructor } from '@/views/cabinets/DataLoader';
import { EntitiesState } from '@/store/entities/types';
import { EntityListFilter } from '@/store/entities/types';
import { SET_FILTER } from '@/store/entities/mutations-types';

export interface ListPage {
    isEmpty: boolean;
    filteredEntities: NamedEntityDict;
    deleteCallback: (id: number) => Promise<void>;
    setFilterValue: (filter: string) => void;
    dataLoader: DataLoader;

    filter(state: EntitiesState): EntityListFilter;
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
        @context.Mutation(SET_FILTER_VALUE) setFilterValue!: (filterValue: string) => void;
        @context.Mutation(SET_FILTER) setFilter!: (filter: (state: EntitiesState) => EntityListFilter) => void;

        filter(state: EntitiesState): EntityListFilter {
            return (id: number) => state.entities[id].name.toLowerCase().includes(state.filterValue);
        }

        mounted() {
            this.setFilter(this.filter);
            return this.dataLoader.startLoading();
        }
    }

    return EntityListPage;
}
