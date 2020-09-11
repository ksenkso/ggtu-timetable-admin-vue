import {BindingHelpers} from "vuex-class/lib/bindings";
import {Component, Vue} from "vue-property-decorator";
import {GET_ALL_ENTITIES} from "@/store/entities/action-types";

export default function entityPage(context: BindingHelpers) {
    @Component({
        name: 'EntityListPage',
    })
    class EntityListPage extends Vue {
        @context.Action(GET_ALL_ENTITIES) getAll!: () => Promise<void>;
        mounted() {
            this.getAll();
        }
    }

    return EntityListPage;
}
