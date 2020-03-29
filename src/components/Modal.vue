<template>
  <div class="modal is-active" v-if="show">
    <div @click="$emit('close')" class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <slot></slot>
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close"  @click="$emit('close')"></button>
  </div>
</template>

<script>
  export default {
    name: "Modal",
    props: {
      show: Boolean
    },
    data() {
      return {
        // show: false
      }
    }
  }
</script>

<style scoped>

</style>
