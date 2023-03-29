<script setup lang="ts">
import { computed, reactive } from 'vue'
import type { AcademyTraining } from '@/types'

import FullModal from '@/components/FullModal.vue'
import CloseButton from '@/components/CloseButton.vue'
import Icon from '@/components/icons/Index.vue'
import WarningIcon from '@/components/icons/Warning.vue'
import QRPaymentInstruction from '@/components/QRPaymentInstruction.vue'

const props = defineProps<{ item?: AcademyTraining }>()
const emit = defineEmits<{
  (e: 'registerClick'): void
}>()

// Load course detail

const state = reactive<{
  showPaymentInstruction: boolean
  showCancelModal: boolean
}>({
  showPaymentInstruction: false,
  showCancelModal: false
})

const titleClass = computed(() => {
  return 'failed'
})

const allowPayment = computed(() => {
  return props.item?.paymentFlag === 'Y'
})

const lecturerNames = computed(() => {
  if (props.item?.listLecturer) {
    return props.item?.listLecturer.map((o) => o.lecturerName).join(', ')
  }
  return '-'
})

const allowRegister = computed(() => {
  return props.item?.canRegister === 'Y'
})

const doApply = () => {
  emit('registerClick')
}
</script>

<template>
  <div class="container px-3 pt-4">
    <slot name="top"></slot>
    <div class="course-title p-3 mb-4" :class="titleClass">
      <h1 class="fw-bold" v-html="item?.courseTitle"></h1>
      <p class="m-0">
        สถานะ:
        <span>{{ item?.trainingStatus }}</span>
      </p>
      <p class="m-0">
        อบรม:
        <span v-html="item?.trainingDateTime"></span>
      </p>
    </div>
    <div class="mb-4">
      <p class="m-0">
        ชื่อย่อ:
        <span class="text-primary">{{ item?.courseTitleShort || '-' }}</span>
      </p>
      <p class="m-0">
        วันและเวลาที่อบรม:
        <span class="text-primary">
          {{ item?.trainingDateTime || '-' }}
        </span>
      </p>
      <p class="m-0">
        วิทยากร:
        <span class="text-primary">
          {{ lecturerNames }}
        </span>
      </p>
      <p class="m-0">
        จำนวนที่เปิดรับ:
        <span class="text-primary">{{ item?.totalSeat || '-' }}</span>
      </p>
      <p class="m-0">
        จำนวนที่นั่งคงเหลือ:
        <span class="text-primary">{{ item?.seat || '-' }}</span>
      </p>
      <p class="m-0">
        รูปแบบการอบรม:
        <span class="text-primary">{{ item?.trainingModel || '-' }}</span>
      </p>
      <p class="m-0">
        ค่าอบรม:
        <span class="text-primary">
          {{ item?.price }}
        </span>
      </p>
      <p class="m-0">
        ระยะเวลารับสมัคร:
        <span class="text-primary">{{ item?.admissionPeriod || '-' }}</span>
      </p>
    </div>
    <div class="mb-4">
      <p class="m-0">รายละเอียดของรูปแบบอบรม:</p>
      <div class="m-0 text-primary" v-html="item?.courseTitle || '-'"></div>
    </div>
    <div class="mb-4" v-if="item?.qualifications">
      <p class="m-0">คุณสมบัติผู้เข้าอบรม:</p>
      <div class="text-primary">
        <ol>
          <li v-for="i in item?.qualifications" :key="i.qualification">
            {{ i.qualification }}
          </li>
        </ol>
      </div>
    </div>
    <div class="mb-4" v-if="item?.listPrerequisite">
      <p class="m-0">อุปกรณ์สำหรับการอบรม:</p>
      <div class="text-primary">
        <ol>
          <li v-for="i in item.listPrerequisite" :key="i.preRequisiteName">
            {{ i.preRequisiteName }}
          </li>
        </ol>
      </div>
    </div>
    <div class="mb-4">
      <p class="m-0">สิ่งสำคัญ (Note สำหรับผู้เข้าร่วมการอบรม):</p>
      <div class="m-0 text-primary" v-html="item?.remark || '-'"></div>
    </div>
    <div style="height: 300px"></div>
  </div>

  <div class="footer-content book" v-if="allowRegister || allowPayment">
    <div class="container px-4 text-center mb-2">
      <button
        class="btn btn-green text-primary w-75"
        type="button"
        v-if="allowRegister"
        @click="doApply"
      >
        จองคอร์สอบรม
      </button>
      <button
        class="btn btn-green text-primary w-75"
        type="button"
        v-else-if="allowPayment"
        @click="doApply"
      >
        กลับไปชำระเงินอีกครั้ง
      </button>
    </div>
    <div class="container px-4 text-center" v-if="allowPayment">
      <button
        class="btn fw-normal fs-6 text-decoration-underline"
        type="button"
        @click="state.showPaymentInstruction = true"
      >
        <Icon :width="16" :height="16" class="me-1"><WarningIcon /></Icon>
        วิธีการชำระเงินโดยการสแกน QR Code
      </button>
    </div>
  </div>

  <!-- QR Code Instruction -->
  <FullModal :opened="state.showPaymentInstruction">
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
              @click="state.showPaymentInstruction = false"
            />
          </div>
        </div>
        <QRPaymentInstruction />
      </div>
    </div>
  </FullModal>
</template>

<style lang="scss" scoped>
.course-title {
  background-color: $blue-pale;
  border-radius: 0.25rem;
  box-shadow: 0px 1px 3px 0px rgba($black, 0.15);
  color: $primary;
  h1 {
    font-size: 20px;
  }
  &.paid {
    background-color: $primary;
    color: $white;
  }
  &.pending {
    background-color: $light-blue;
    color: $white;
  }
  &.not_paid,
  &.canceled,
  &.canceled_by_company,
  &.failed,
  &.absented {
    background-color: $gray;
    color: $white;
  }
}
</style>
