<template>
  <Page :title="title">
    <Form v-if="model" send-button-text="Сохранить" @submit="onSubmit">
      <Field @input="updateName" label="Номер" name="number" type="number" :initial-value="model.number"></Field>
      <Field label="Этаж" name="floor" type="number" :initial-value="''+model.floor"></Field>
      <Field ref="nameField" label="Название" name="name" :initial-value="model.name"></Field>
      <Field label="Здание" name="buildingId">
        <template v-slot:input="{updateValue}">
          <Select :initial-value="model.buildingId" name="buildingId" @change="updateValue"
                  :options="buildings"></Select>
        </template>
      </Field>
    </Form>
  </Page>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { Ref } from 'vue-property-decorator';
import Page from '../Page.vue';
import { Cabinet, WithId } from 'ggtu-timetable-api-client';
import Form from '@/components/forms/Form.vue';
import Field from '@/components/forms/Field.vue';
import { namespace } from 'vuex-class';
import entityView from '@/mixins/EntityView';
import { api } from '@/api';
import Select from '@/components/forms/Select.vue';
import { SelectOption } from '@/utils/lists';

const cabinets = namespace('cabinets');

@Component({
  name: 'BuildingView',
  components: { Page, Form, Select, Field }
})
export default class CabinetView extends entityView<Cabinet>(cabinets) {
  @Ref('nameField') nameField!: Field;
  redirectRoute = '/cabinets';
  buildings: SelectOption[] = [];

  get title(): string {
    return this.$route.params.id ? 'Редактирование кабинета' : 'Добавление кабинета';
  }

  updateName(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    if (target.name === 'number') {
      if (this.nameField) {
        this.nameField.updateValue(`Кабинет ${target.value}`);
      }
    }
  }

  getEntity = (id: number): Promise<WithId<Cabinet>> => {
    return api.cabinets.get(id);
  }

  getDefaultModel(): Cabinet {
    return {
      buildingId: 0, floor: 1, id: 0, name: '', number: ''
    }
  }

  mounted() {
    api.buildings.getAll()
        .then(buildings => {
          this.buildings = buildings.map(building => ({ name: building.name, value: building.id }));
        });
  }

}
</script>

<style scoped>

</style>
