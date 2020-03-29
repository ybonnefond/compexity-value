<template>
  <section class="section">
    <nav class="level">
      <div class="level-left">
        <file-loader></file-loader>
        <chart-config></chart-config>
      </div>
      <div class="level-right">
        <reset-file></reset-file>
      </div>
    </nav>

    <hr />

    <bubble-chart></bubble-chart>
  </section>
</template>

<script lang="ts">
  import FileLoader from "./components/FileLoader.vue";
  import ChartConfig from "./components/ChartConfig.vue";
  import ResetFile from "./components/ResetFile.vue";
  import BubbleChart from './components/BubbleChart.vue';

  export default {
    components: {FileLoader, ChartConfig, ResetFile, BubbleChart}
  }
</script>

<style lang="scss">
  @import "~bulma/bulma.sass";
  @import "~bulmaswatch/slate/_variables.scss";
  @import "~bulmaswatch/slate/_overrides.scss";

  section {

  }
</style>
