<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    :width="width"
    :height="height"
    :fill="color"
  >
    <slot></slot>
  </svg>
</template>

<script lang="ts">
export default {
  props: {
    width: {
      type: Number,
      default: 64
    },
    height: {
      type: Number,
      default: 64
    },
    color: {
      type: String,
      default: 'currentColor'
    }
  }
}
</script>
