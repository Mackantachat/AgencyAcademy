<script setup lang="ts">
import { computed, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  applyTraining,
  cancelApplication,
  fetchTrainingHistory
} from '@/services/AcademyService'
import type { AcademyTraining } from '@/types'

import FullModal from '@/components/FullModal.vue'
import { useAppModal } from '@/stores/TempStore'
import LoadingView from '@/components/LoadingView.vue'
import TrainingDetailView from '@/views/Course/TraningDetailView.vue'
import BackButton from '@/components/BackButton.vue'

const router = useRouter()
const route = useRoute()
const appModal = useAppModal()

const { id } = route.params

onMounted(async () => {
  await fetchItem()
})

const state = reactive<{
  item?: AcademyTraining
  showCancelModal: boolean
  loading: boolean
}>({
  item: undefined,
  showCancelModal: false,
  loading: false
})

const allowCancel = computed(() => {
  return state.item?.canCancel === 'Y'
})

const allowPayment = computed(() => {
  return state.item?.paymentFlag === 'Y'
})

const fetchItem = async () => {
  state.loading = true
  try {
    const training = await fetchTrainingHistory(id as string)
    state.item = training
  } finally {
    state.loading = false
  }
}

const doApply = async () => {
  state.loading = true
  try {
    const ok = await applyTraining(id as string)
    if (ok) {
      if (allowPayment.value) {
        // Continue to payment page if this item require payment
        router.push({ name: 'Payment', params: { id } })
      } else {
        // Registration completed.
        router.push({ name: 'RegisterComplete' })
      }
    }
  } catch (error) {
    console.log('apply training error', error)
    if (error instanceof Error) {
      appModal.openModal('Error', error.message)
    }
  } finally {
    state.loading = false
  }
}

const doCancel = async () => {
  try {
    state.loading = true
    await cancelApplication(id as string)

    // Redirect back to list view.
    router.push({ name: 'Course', query: { tab: 'history' } })
  } catch (error) {
    console.log('cancel training error', error)
    if (error instanceof Error) {
      appModal.openModal('Error', error.message)
    }
  } finally {
    state.loading = false
    state.showCancelModal = false
  }
}
</script>

<template>
  <TrainingDetailView :item="state.item" @register-click="doApply">
    <template #top>
      <div class="row align-items-center mb-3">
        <div class="col-6">
          <BackButton />
        </div>
        <div class="col-6 text-end" v-if="allowCancel">
          <button
            class="btn text-decoration-underline fw-normal fs-6"
            type="button"
            @click="state.showCancelModal = true"
          >
            ยกเลิกการจอง
          </button>
        </div>
      </div>
    </template>
  </TrainingDetailView>

  <!-- Cancel -->
  <FullModal :opened="state.showCancelModal">
    <div class="full-page">
      <div class="container px-3 pt-4">
        <div class="row align-items-start mb-3">
          <div class="col-10">
            <h5 class="text-primary fw-bold m-0">ยกเลิกการจองคอร์สอบรม</h5>
          </div>
          <div class="col-2 text-end">
            <CloseButton
              class="text-primary"
              @click="state.showCancelModal = false"
            />
          </div>
        </div>
        <h6 class="text-primary">
          คุณต้องการยกเลิกการจองคอร์สอบรมนี้ใช่หรือไม่
        </h6>
        <p>
          หากใช่ กดปุ่ม "ยืนยัน" เพื่อดำเนินการยกเลิก<br />หากไม่ใช่ กดปุ่ม
          "ย้อนกลับ"
        </p>
        <p>
          หมายเหตุ: หลังจากที่คุณกด "ยืีนยัน" แล้ว
          ระบบจะทำการยกเลิกการจองของคุณทันที หากคุณต้องการจะจองคอร์สอบรมนี้ใหม่
          กรุณาดำเนินการตั้งแต่ต้นใหม่อีกครั้ง
        </p>
      </div>
      <div class="footer-content">
        <div class="container px-4">
          <div class="row">
            <div class="col-6">
              <button
                class="btn text-primary text-decoration-underline"
                type="button"
                @click="state.showCancelModal = false"
              >
                ย้อนกลับ
              </button>
            </div>
            <div class="col-6 text-end">
              <button
                class="btn btn-green text-primary"
                type="button"
                @click="doCancel"
              >
                ยืนยัน
              </button>
            </div>
            <div class="col-6"></div>
          </div>
        </div>
      </div>
    </div>
  </FullModal>
  <LoadingView v-if="state.loading" />
</template>
