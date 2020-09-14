import {Component, Vue} from "vue-property-decorator";
import {NavigationGuardNext, RawLocation, Route} from "vue-router";
import {BindingHelpers} from "vuex-class/lib/bindings";
import {CREATE_ENTITY, UPDATE_ENTITY} from "@/store/entities/action-types";
import {WithId} from "ggtu-timetable-api-client";
import {NamedEntity} from "@/store/entities/types";

export default function entityView<T extends NamedEntity>(context: BindingHelpers) {

    Component.registerHooks([
        'beforeRouteEnter',
    ]);

    @Component({
        name: 'EntityView',
   })
    class EntityView extends Vue {

        isLoading = false;
        loaded = false;

        get title(): string {
            return this.$route.params.id ? 'Редактирование' : 'Добавление';
        }

        redirectRoute: RawLocation = '/';
        model: T | null = null;
        getEntity!: (id: number) => Promise<WithId<T>>;

        @context.Action(UPDATE_ENTITY) update!: (entity: WithId<T>) => Promise<void>;
        @context.Action(CREATE_ENTITY) create!: (entity: T) => Promise<void>;

        onSubmit(data: T) {
            let request;
            if (this.model?.id) {
                request = this.update({...data, id: this.model.id});
            } else {
                request = this.create({...data});
            }

            request.then(() => {
                this.$router.push(this.redirectRoute);
            })
        }

        beforeRouteEnter(to: Route, from: Route, next: NavigationGuardNext) {
            next((vm: Vue) => {
                if (to.params.id) {
                    (vm as EntityView).isLoading = true;
                    (vm as EntityView).getEntity(+to.params.id)
                        .then((model) => {
                            (vm as any).model = model;
                            (vm as EntityView).isLoading = false;
                            (vm as EntityView).loaded = true;
                            next();
                        });
                } else {
                    (vm as any).model = {name: ''};
                }
            })
        }
    }

    return EntityView;
}


