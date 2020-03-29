<template>
  <form v-if="isVisible">
    <div class="field is-horizontal">
      <div class="select is-small">
        <select v-model="x">
          <option value="">Pick X value...</option>
          <option v-for="key in numberKeys" :value="key">X: {{key}}</option>
        </select>
      </div>

      <div class="select is-small">
        <select v-model="y">
          <option value="">Pick Y value...</option>
          <option v-for="key in numberKeys" :value="key">Y: {{key}}</option>
        </select>
      </div>

      <div class="select is-small">
        <select v-model="r">
          <option value="">Pick Size value...</option>
          <option v-for="key in numberKeys" :value="key">Size: {{key}}</option>
        </select>
      </div>

      <button
        v-on:click="setChartConfig({x, y, r})"
        type="button"
        class="button is-primary  is-small">Go</button>
    </div>
  </form>
</template>

<script lang="ts">
  import {mapActions, mapState} from 'vuex';
  import {KeyValue} from "../entities/Key";

  export default {
    name: "ChartConfig",
    computed: {
      ...mapState(['issues', 'keys', 'chartConfig']),
      isVisible(): boolean {
        return this.issues.length > 0;
      },
      numberKeys() {
        return this.filterKeys('number');
      }
    },
    data() {
      return {
        x: '',
        y: '',
        r: ''
      }
    },
    watch: {
      chartConfig(val) {
        this.x = val.x;
        this.y = val.y;
        this.r = val.r;
      }
    },
    methods: {
      ...mapActions(['setChartConfig']),
      filterKeys(by: KeyValue): string[] {
        const keys = [];
        for( const key in this.keys) {
          if (this.keys[key] === by) {
            keys.push(key);
          }
        }
        return keys;
      },
    }
  }
</script>

<style scoped>
  div.field > div {
    margin-right: 10px;
  }
</style>
