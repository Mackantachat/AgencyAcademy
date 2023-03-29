<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import Icon from '@/components/icons/Index.vue'
import IconRemove from '@/components/icons/Remove.vue'
import Modal from '@/components/Modal.vue'
import { numberWithCommas } from '@/Helpers'
</script>

<template>
  <div class="row py-3">
    <div class="col-6">
      <p class="m-0">{{ item.name }}</p>
    </div>
    <div class="col-4 text-end pe-0">
      <span class="text-primary fw-bold"
        >{{ numberWithCommas(item.price) }} บาท</span
      >
    </div>
    <div class="col-2 text-end">
      <button
        class="btn text-primary p-0 border-0"
        @click.prevent="removeItem(item)"
      >
        <Icon :width="22" :height="22"><IconRemove /></Icon>
      </button>
    </div>
  </div>
  <Modal v-if="isDeleteModalOpened">
    <h4 class="fs-5 fw-bold">ลบรายการ</h4>
    <p>คุณต้องการจะลบรายการ "{{ seletedItem.name }}"</p>
    <div class="col-12 text-end">
      <button
        class="btn btn-light me-2"
        type="button"
        @click.prevent="cancelDelete"
      >
        ยกเลิก
      </button>
      <button
        class="btn btn-primary"
        type="button"
        @click.prevent="confirmDelete(seletedItem.id)"
      >
        ยืนยัน
      </button>
    </div>
  </Modal>
</template>

<script lang="ts">
let item: any
let seletedItem: any
export default {
  props: {
    item,
    updateFn: Function
  },
  data() {
    return {
      seletedItem,
      isDeleteModalOpened: false
    }
  },
  methods: {
    removeItem(item: any) {
      this.seletedItem = item
      this.isDeleteModalOpened = true
    },
    confirmDelete(id: any) {
      const cart = useCartStore()
      cart.removeItem(id)
      this.cancelDelete()
      if (this.updateFn) {
        this.updateFn()
      }
    },
    cancelDelete() {
      this.seletedItem = null
      this.isDeleteModalOpened = false
    }
  }
}
</script>
