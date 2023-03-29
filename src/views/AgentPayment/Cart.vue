<script setup lang="ts">
import { RouterLink } from 'vue-router'
import axios from 'axios'
import { useCartStore } from '@/stores/cart'
import Header from '@/components/layouts/HeaderView.vue'
import Loading from '@/components/LoadingView.vue'
import CartItem from '@/components/CartItem.vue'
import FullModal from '@/components/FullModal.vue'
import CloseButton from '@/components/CloseButton.vue'
import QRPaymentInstruction from '@/components/QRPaymentInstruction.vue'
import Icon from '@/components/icons/Index.vue'
import IconAdd from '@/components/icons/Add.vue'
import WarningIcon from '@/components/icons/Warning.vue'
import AgentPayment from '@/components/AgentPayment.vue'
import { numberWithCommas } from '@/Helpers'
</script>

<template>
  <Header />
  <div class="page full-page">
    <div class="container px-3 py-4">
      <h1 class="text-primary fw-bold fs-4">รวมรายการที่ต้องชำระ</h1>
      <div v-if="!cart.length">
        <img
          src="@/assets/img/P_BEE_MAI_A.svg"
          class="d-block mx-auto my-4 img-fluid"
          alt="P_BEE_MAI_A"
        />
        <p class="text-center text-primary mb-2">ไม่มีรายการที่ต้องชำระเงิน</p>
        <p class="text-center">
          <RouterLink to="/agent-payment">
            กลับสู่หน้าชำระค่าธรรมเนียมธุรกรรมตัวแทน
          </RouterLink>
        </p>
      </div>
      <div v-else>
        <div class="border-bottom" v-for="item in cart" :key="item.id">
          <CartItem :item="item" :updateFn="updateTotal"></CartItem>
        </div>
        <div class="row py-3">
          <div class="col-10 text-end pe-0">
            <span class="text-primary fw-bold fs-5"
              >รวม {{ numberWithCommas(total) }} บาท</span
            >
          </div>
        </div>
        <button
          type="button"
          class="btn text-primary d-inline-flex align-items-center px-0 border-0"
          @click="isAgentPaymentOpened = true"
        >
          <Icon :width="22" :height="22" class="me-2"><IconAdd /></Icon>
          เพิ่มรายการที่ชำระ
        </button>
        <div class="footer-content">
          <div class="container px-4 text-center mb-2">
            <button
              class="btn btn-green text-primary w-75"
              type="button"
              @click="pay"
            >
              สแกน QR Code เพื่อชำระเงิน
            </button>
          </div>
          <div class="container px-4 text-center">
            <button
              class="btn fw-normal fs-6 text-decoration-underline"
              type="button"
              @click="isPaymentInsOpened = true"
            >
              <Icon :width="16" :height="16" class="me-1"><WarningIcon /></Icon>
              วิธีการชำระเงินโดยการสแกน QR Code
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- QR Code Instruction -->
  <FullModal :opened="isPaymentInsOpened">
    <div class="full-page">
      <div class="container px-3 pt-4">
        <div class="row align-items-start mb-3">
          <div class="col-10">
            <h5 class="text-primary fw-bold m-0">
              การชำระเงินโดยการสแกน QR Code ผ่านแอปทุกธนาคาร
            </h5>
          </div>
          <div class="col-2 text-end">
            <CloseButton
              class="text-primary"
              @click="isPaymentInsOpened = false"
            />
          </div>
        </div>
        <QRPaymentInstruction />
      </div>
    </div>
  </FullModal>

  <FullModal :opened="isAgentPaymentOpened">
    <div class="full-page">
      <div class="container px-3 pt-4">
        <div class="row align-items-start mb-3">
          <div class="col-10">
            <h5 class="text-primary fw-bold m-0 fs-4">
              ชำระค่าธรรมเนียมธุรกรรมตัวแทน
            </h5>
          </div>
          <div class="col-2 text-end">
            <CloseButton
              class="text-primary"
              @click="isAgentPaymentOpened = false"
            />
          </div>
        </div>
        <AgentPayment :isModal="true" :closeFn="closeAgentPayment" />
      </div>
    </div>
  </FullModal>

  <!-- Agent Payment -->
  <Loading v-if="!isLoaded" />
</template>

<script lang="ts">
let cart: any[] = []
export default {
  data() {
    return {
      cart,
      total: 0,
      isLoaded: false,
      isPaymentInsOpened: false,
      isAgentPaymentOpened: false
    }
  },
  mounted() {
    this.getCart()
  },
  methods: {
    getCart() {
      const cart = useCartStore()
      this.cart = cart.lists
      this.total = cart.total
      this.isLoaded = true
    },
    closeAgentPayment() {
      this.isAgentPaymentOpened = false
      this.updateTotal()
    },
    updateTotal() {
      const cart = useCartStore()
      this.total = cart.total
    },
    pay(e: any) {
      e.preventDefault()
      const _vm = this
      const id = '031884ea-91d2-4d8f-a835-4a1f57666931'
      _vm.isLoaded = false
      axios
        .post(`/api/v1/verify`, { id })
        .then((res) => {
          if (res.data.status === true) {
            const cart = useCartStore()
            cart.clearCart() // Clear cart
            _vm.$router.push({ name: 'Payment', params: { id } })
          }
        })
        .catch((err) => {
          _vm.isLoaded = true
        })
    }
  }
}
</script>
