<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.getElementsByTagName('body')[0].style.overflow = 'hidden'
})

onUnmounted(() => {
  document.getElementsByTagName('body')[0].style.overflow = ''
})
</script>

<template>
  <teleport to="body">
    <div class="loading-contains">
      <div class="spin-contains">
        <div class="dot-item"></div>
        <div class="dot-item"></div>
        <div class="dot-item"></div>
        <div class="dot-item"></div>
      </div>
    </div>
  </teleport>
</template>

<style lang="scss" scoped>
.loading-contains {
  align-items: center;
  background-color: rgba($white, 0.5);
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  user-select: none;
  z-index: 10002;
  .spin-contains {
    display: block;
    height: 2.5rem;
    position: relative;
    transform: rotate(45deg);
    width: 2.5rem;
    animation: appRotate 1.2s infinite linear;
    .dot-item {
      background-color: $primary;
      border-radius: 50%;
      display: block;
      height: 0.875rem;
      opacity: 0.3;
      position: absolute;
      transform-origin: 50% 50%;
      width: 0.875rem;
      animation: spinMove 1s infinite linear alternate;
      &:nth-child(1) {
        left: 0;
        top: 0;
      }
      &:nth-child(2) {
        right: 0;
        top: 0;
        animation-delay: 0.4s;
      }
      &:nth-child(3) {
        bottom: 0;
        left: 0;
        animation-delay: 0.8s;
      }
      &:nth-child(4) {
        bottom: 0;
        right: 0;
        animation-delay: 1.2s;
      }
    }
  }
}
@keyframes spinMove {
  to {
    opacity: 1;
  }
}
@keyframes appRotate {
  to {
    transform: rotate(405deg);
  }
}
</style>
