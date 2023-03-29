<template>
  <teleport to="body">
    <div class="modal-wrapper d-flex align-items-center justify-content-center">
      <div class="modal-box">
        <slot />
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
export default {
  mounted() {
    setTimeout(() => {
      document.getElementsByTagName("body")[0].style.overflow = "hidden";
    }, 100);
  },
  unmounted() {
    document.getElementsByTagName("body")[0].style.overflow = "";
  },
};
</script>

<style lang="scss" scoped>
.modal-wrapper {
  background-color: rgba($white, 0.05);
  backdrop-filter: saturate(180%) blur(10px);
  height: 100%;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10002;
  .modal-box {
    background-color: $white;
    border-radius: 0.5rem;
    box-shadow: 0px 0px 15px 0px rgba($primary, 0.2);
    max-width: 450px;
    padding: 1rem;
    width: 90%;
  }
}
</style>
