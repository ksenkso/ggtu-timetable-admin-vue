import {Component, Vue} from "vue-property-decorator";
import Form from "@/components/forms/Form.vue";
import Field from "@/components/forms/Field.vue";
import Page from "@/views/Page.vue";
import {NavigationGuardNext, RawLocation, Route} from "vue-router";

Component.registerHooks([
    'beforeRouteEnter',
])

@Component({
    name: 'EntityView',
    components: {Page, Form, Field}
})
export default class EntityView<T extends {name: string; id?: number}> extends Vue {
    redirectRoute: RawLocation = '/';
    model: T | null = null;

    get title(): string {
        return this.$route.params.id ? 'Редактирование' : 'Добавление';
    }

    update!: (data: {name: string; id: number}) => Promise<void>;
    create!: (data: {name: string}) => Promise<void>;
    getEntity!: (id: number) => Promise<T>;

    onSubmit({name}: {name: string}) {
        let request;
        if (this.model?.id) {
            request = this.update({name, id: this.model.id});
        } else {
            request = this.create({name});
        }

        request.then(() => {
            this.$router.push(this.redirectRoute);
        })
    }

    beforeRouteEnter(to: Route, from: Route, next: NavigationGuardNext) {
        next((vm: Vue) => {
            if (to.params.id) {
                (vm as EntityView<T>).getEntity(+to.params.id)
                    .then((model) => {
                        (vm as any).model = model;
                        next();
                    });
            } else {
                (vm as any).model = {name: ''};
            }
        })
    }
}
