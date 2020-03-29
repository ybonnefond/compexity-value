<template>
  <button
    v-if="isVisible"
    v-on:click="resetFile()"
    class="button is-danger  is-small">Reset file</button>
</template>

<script lang="ts">
  import {mapActions, mapState} from 'vuex';
  import {KeyValue} from "../entities/Key";

  export default {
    name: "ResetFile",
    computed: {
      ...mapState(['issues']),
      isVisible(): boolean {
        return this.issues.length > 0;
      }
    },
    methods: {
      ...mapActions([
        'resetFile',
      ])
    }
  }
</script>

<style scoped>
  div.field > div {
    margin-right: 10px;
  }
</style>
