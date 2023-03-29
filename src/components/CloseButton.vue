<script setup lang="ts">
import Icon from "@/components/icons/Index.vue";
import IconClose from "@/components/icons/Close.vue";
</script>
<template>
  <button
    class="close-btn d-inline-flex align-items-center justify-content-center"
    type="button"
  >
    <Icon :width="16" :height="16"><IconClose /></Icon>
  </button>
</template>

<style lang="scss" scoped>
.close-btn {
  background-color: transparent;
  border: none;
  border-radius: 0.25rem;
  height: 2rem;
  overflow: hidden;
  padding: 0;
  position: relative;
  width: 2rem;
  &:hover {
    background-color: $blue-pale;
  }
}
</style>
