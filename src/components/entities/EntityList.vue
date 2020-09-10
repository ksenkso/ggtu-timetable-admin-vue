<template>
  <ul class="entity-list">
    <li v-for="entity in entities" :key="entity.id" class="entity-list__item">
      <router-link class="entity-list__name" :to="`${editRoute}/${entity.id}`">{{ entity.name }}</router-link>
      <Button class="entity-list__delete" theme="danger" @click="deleteEntity(entity)">Удалить</Button>
    </li>
  </ul>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import Button from '@/components/common/Button.vue';
import {NamedEntity, NamedEntityDict} from '@/store/entities/types.js';

@Component({
  name: 'EntityList',
  components: {Button}
})
export default class EntityList extends Vue {

  @Prop({required: true})
  entities!: NamedEntityDict;

  @Prop({required: true})
  deleteCallback!: Function;

  @Prop({required: true})
  editRoute!: string;

  deleteEntity(entity: NamedEntity) {
    const shouldDelete = confirm(`Удалить ${entity.name}?`);
    if (shouldDelete) {
      this.deleteCallback();
    }
  }
}
</script>

<style scoped>

</style>
