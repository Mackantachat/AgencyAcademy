<script setup lang="ts">
import { computed, defineProps } from 'vue'

const props = defineProps<{
  current: number
  total: number
  title?: String
}>()

const itemStyle = computed(() => ({
  width: 100 / props.total + '%'
}))
</script>

<template>
  <ul class="progress-wrapper d-flex align-items-center">
    <li
      :style="itemStyle"
      v-for="n in total"
      :key="n"
      :class="{ current: current === n, active: current > n }"
    ></li>
  </ul>
  <p class="text-center fw-bold fs-5 m-0">{{ title }}</p>
</template>

<style lang="scss" scoped>
.progress-wrapper {
  list-style-type: none;
  margin: 1rem auto 0.5rem;
  padding: 0;
  position: relative;
  width: 80%;
  li {
    display: block;
    position: relative;
    text-align: center;
    span {
      display: inline-block;
      height: 0;
      overflow: hidden;
      width: 0;
    }
    &:before {
      content: '';
      background-color: $white;
      border: 2px solid $green;
      border-radius: 50%;
      display: block;
      height: 0.75rem;
      margin: 0 auto;
      width: 0.75rem;
      z-index: 1;
    }
    &:after {
      content: '';
      background-color: $green;
      display: block;
      height: 2px;
      left: -50%;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      z-index: -1;
    }
    &.active {
      &:before {
        background-color: $green;
      }
    }
    &.current {
      &:before {
        background-color: $white;
        height: 1.2rem;
        width: 1.2rem;
      }
    }
    &:first-child {
      &:after {
        display: none;
      }
    }
  }
}
</style>
