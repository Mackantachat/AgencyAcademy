<template>
  <teleport to="body">
    <transition name="slide-up">
      <div class="modal-wrapper" v-if="opened">
        <slot />
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
export default {
  props: {
    opened: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    opened(val) {
      if (val) {
        document.getElementsByTagName('body')[0].style.overflow = 'hidden'
      } else {
        document.getElementsByTagName('body')[0].style.overflow = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-wrapper {
  background-color: $white;
  border-radius: 2rem 2rem 0 0;
  box-shadow: 0px 0px 10px 0px rgba($black, 0.1);
  height: 100%;
  left: 0;
  position: fixed;
  top: 0.5rem;
  width: 100%;
  z-index: 10002;
  & ~ .modal-wrapper {
    top: 1.5rem;
  }
}
</style>
