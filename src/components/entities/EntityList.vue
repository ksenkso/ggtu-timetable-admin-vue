<template>
  <ul class="entity-list">
    <li v-for="entity in entities" :key="entity.id" class="entity-list__item">
      <router-link class="entity-list__link" :to="`${editRoute}/${entity.id}`">{{ entity.name }}</router-link>
      <Button class="entity-list__delete" theme="danger" @click.native="deleteEntity(entity)">Удалить</Button>
    </li>
  </ul>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import Button from '@/components/common/Button.vue';
import {NamedEntity, NamedEntityDict} from '@/store/entities/types.js';
import {WithId} from "ggtu-timetable-api-client";

@Component({
  name: 'EntityList',
  components: {Button}
})
export default class EntityList extends Vue {

  @Prop({required: true})
  entities!: NamedEntityDict;

  @Prop({required: true})
  deleteCallback!: (id: number) => Promise<void>;

  @Prop({required: true})
  editRoute!: string;

  deleteEntity(entity: WithId<NamedEntity>) {
    const shouldDelete = confirm(`Удалить ${entity.name}?`);
    if (shouldDelete) {
      this.deleteCallback(entity.id);
    }
  }
}
</script>

<style scoped lang="sass">
@import "../../assets/variables"
@import "../../assets/mixins"
.entity-list
  list-style-type: none
  padding: 0
  margin: 0
  border: 1px solid #ddd
  border-radius: 3px
  &__item
    border-bottom: 1px solid #ddd
    padding: 8px 12px
    display: flex
    align-items: baseline
    align-content: baseline
    &:hover
      background-color: #eee
    .button
      margin-left: auto
    &:last-child
      border-bottom: none
  &__link
    text-decoration: none
    cursor: pointer
    color: map-get($colors, "dark")
    position: relative
    width: 100%
    margin-right: 1em
</style>
