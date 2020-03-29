<template>
  <div v-if="isVisible" class="file has-name is-right is-small">
    <label class="file-label">
      <input class="file-input" type='file' @change="setFile($event.target.files[0])">
      <span class="file-cta">
        <span class="file-label">
          Choose a file…
        </span>
      </span>
      <span class="file-name">...</span>
    </label>
  </div>
</template>

<script lang="ts">
  import {mapActions,mapState} from 'vuex';

  type FileEventTarget = EventTarget & { files: FileList };
  type FileInputEvent = Event & { target: FileEventTarget };

  export default {
    name: "FileLoader",
    computed: {
      ...mapState(['file']),
      isVisible(): boolean {
        return this.file === null;
      }
    },
    methods: {
      ...mapActions([
        'setFile',
      ]),
    }
  }
</script>

<style lang="scss" scoped>
  button {
    margin-left: 10px;
  }
</style>
