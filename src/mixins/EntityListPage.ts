import {BindingHelpers} from "vuex-class/lib/bindings";
import {Component, Vue} from "vue-property-decorator";
import {DELETE_ENTITY, GET_ALL_ENTITIES} from "@/store/entities/action-types";
import {NamedEntityDict} from "@/store/entities/types";
import {SET_FILTER} from "@/store/entities/mutations-types";

export default function entityListPage(context: BindingHelpers) {
    @Component({
        name: 'EntityListPage',
    })
    class EntityListPage extends Vue {
        @context.Action(GET_ALL_ENTITIES) getAll!: () => Promise<void>;
        @context.Getter('isEmpty') isEmpty!: boolean;
        @context.Getter('filteredEntities') filteredEntities!: NamedEntityDict;
        @context.Action(DELETE_ENTITY) deleteCallback!: (id: number) => Promise<void>;
        @context.Mutation(SET_FILTER) filterCallback!: (filter: string) => void;

        mounted() {
            this.getAll();
        }
    }

    return EntityListPage;
}
