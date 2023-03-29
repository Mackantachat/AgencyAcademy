<script setup lang="ts">
import LoadingView from '@/components/LoadingView.vue'

import { reactive } from 'vue'
import { readFileContent } from '@/Helpers'
import { getCardInfoOCR } from '@/services/AcademyService'
import { useRegisterStore } from '@/stores/RegisterStore'
import { useAppModal } from '@/stores/TempStore'
import { useRouter } from 'vue-router'

const registerStore = useRegisterStore()
const appModal = useAppModal()
const router = useRouter()

const state = reactive({
  isLoaded: true,
  cardFrontImg: '',
  cardBackImg: '',
  selfieImg: '',
  mode: 'card-front-instruction'
})
//#region  Card Front
const onCardFrontChanged = async (e: any) => {
  state.isLoaded = false
  const files = e.target.files
  if (files && files.length > 0) {
    state.cardFrontImg = (await readFileContent(files[0])) as string
    // Show preview image
    state.mode = 'card-front-preview'
  }
  state.isLoaded = true
}

const onCardFrontSubmit = () => {
  state.mode = 'card-back-instruction'
}
//#endregion

//#region  Card Back
const onCardBackChanged = async (e: any) => {
  state.isLoaded = false
  const files = e.target.files
  if (files && files.length > 0) {
    state.cardBackImg = (await readFileContent(files[0])) as string
    // Show preview image
    state.mode = 'card-back-preview'
  }
  state.isLoaded = true
}

const onCardBackSubmit = () => {
  state.mode = 'selfie-instruction'
}

//#endregion

//#region Selfie photo
const onSelfieChanged = async (e: any) => {
  state.isLoaded = false
  const files = e.target.files
  if (files && files.length > 0) {
    state.selfieImg = (await readFileContent(files[0])) as string
    // Show preview image
    state.mode = 'selfie-preview'
  }
  state.isLoaded = true
}

//#endregion

// Submit and verify
const onSubmit = async () => {
  try {
    state.isLoaded = false

    // Remove prefix before comma from data: Ex. 'data:image/jpeg;base64,'
    const i = state.cardFrontImg.indexOf(',')
    const cardFrontB64 = state.cardFrontImg.slice(i + 1)
    const cardBackB64 = state.cardBackImg.slice(i + 1)

    const idInfo = await getCardInfoOCR(cardFrontB64, cardBackB64)

    if (idInfo) {
      // Persist gathered info to registerStore to be used in the next steps.
      registerStore.$patch({
        cardFrontImg: state.cardBackImg,
        cardBackImg: state.cardBackImg,
        selfieImg: state.selfieImg,
        idInfo: idInfo
      })
      console.log('move to next step')
      // OK. Move to next step
      router.push({ name: 'RegisterReview' })
    }
  } catch (error) {
    console.log('error', error)
    if (error instanceof Error) {
      appModal.openModal('Error', error.message)
    }
  } finally {
    state.isLoaded = true
  }
}
</script>

<template>
  <!-- Front card - instruction -->
  <div v-if="state.mode === 'card-front-instruction'">
    <p class="text-center">
      กรุณาเตรียมบัตรประชาชนของคุณ เพื่อถ่ายรูปยืนยันตัวตน
    </p>
    <h2 class="text-primary fs-4 fw-bold">1. ถ่ายภาพหน้าบัตรประชาชน</h2>
    <img
      src="@/assets/img/id-card-front.jpg"
      srcset="@/assets/img/id-card-front@2x.jpg 2x"
      class="d-block mx-auto my-4 img-fluid"
      alt="id-card-front"
    />
    <p class="text-primary">กรุณาตรวจสอบรูปถ่ายให้เป็นไปตามนี้:</p>
    <ol>
      <li>ถ่ายรูปบัตรด้านหน้า และเห็นบัตรเต็มใบ</li>
      <li>
        รูปถ่ายควรมีความสว่าง ไม่มืด
        และสามารถเห็นข้อมูลบนบัตรประชาชนได้อย่างชัดเจน
      </li>
      <li>
        พื้นหลังของรูปควรเป็นสีขาว หรือสีอ่อน
        เพื่อให้เห็นพื้นที่ของบัตรอย่างชัดเจน
      </li>
    </ol>
    <div class="footer-content">
      <div class="container px-4 text-center">
        <input
          type="file"
          accept="image/*"
          id="card-front"
          class="d-none"
          @input="onCardFrontChanged"
        />
        <label for="card-front" class="btn btn-green text-primary w-75">
          ดำเนินการต่อ
        </label>
      </div>
    </div>
  </div>
  <!-- Front card - preview -->
  <div v-else-if="state.mode === 'card-front-preview'">
    <h2 class="text-primary fs-4 fw-bold mt-4">1. ถ่ายภาพหน้าบัตรประชาชน</h2>
    <img
      :src="state.cardFrontImg"
      class="d-block mx-auto my-4 img-fluid"
      alt="id-card-front"
    />
    <div class="footer-content">
      <div class="container px-4 text-center mb-3">
        <button
          class="btn btn-green text-primary w-75"
          type="button"
          @click.prevent="onCardFrontSubmit"
        >
          ดำเนินการต่อ
        </button>
      </div>
      <div class="container px-4 text-center">
        <input
          type="file"
          accept="image/*"
          id="card-front-retake"
          class="d-none"
          @input="onCardFrontChanged"
        />
        <label
          for="card-front-retake"
          class="btn text-primary text-decoration-underline w-75"
        >
          ถ่ายใหม่
        </label>
      </div>
    </div>
  </div>
  <!-- Back card - instruction -->
  <div v-else-if="state.mode === 'card-back-instruction'">
    <h2 class="text-primary fs-4 fw-bold mt-4">2. ถ่ายภาพหลังบัตรประชาชน</h2>
    <img
      src="@/assets/img/id-card-back.jpg"
      srcset="@/assets/img/id-card-back@2x.jpg 2x"
      class="d-block mx-auto my-4 img-fluid"
      alt="id-card-back"
    />
    <p class="text-primary">กรุณาตรวจสอบรูปถ่ายให้เป็นไปตามนี้:</p>
    <ol>
      <li>ถ่ายรูปบัตรด้านหลัง และเห็นบัตรเต็มใบ</li>
      <li>
        รูปถ่ายควรมีความสว่าง ไม่มืด
        และสามารถเห็นข้อมูลบนบัตรประชาชนได้อย่างชัดเจน
      </li>
      <li>
        พื้นหลังของรูปควรเป็นสีขาว หรือสีอ่อน
        เพื่อให้เห็นพื้นที่ของบัตรอย่างชัดเจน
      </li>
    </ol>
    <div class="footer-content">
      <div class="container px-4 text-center">
        <input
          type="file"
          accept="image/*"
          id="card-back"
          class="d-none"
          @input="onCardBackChanged"
        />
        <label for="card-back" class="btn btn-green text-primary w-75">
          ดำเนินการต่อ
        </label>
      </div>
    </div>
  </div>
  <!-- Back card - preview -->
  <div v-else-if="state.mode === 'card-back-preview'">
    <h2 class="text-primary fs-4 fw-bold mt-4">2. ถ่ายภาพหลังบัตรประชาชน</h2>
    <img
      :src="state.cardBackImg"
      class="d-block mx-auto my-4 img-fluid"
      alt="id-card-back"
    />
    <div class="footer-content">
      <div class="container px-4 text-center mb-3">
        <button
          class="btn btn-green text-primary w-75"
          type="button"
          @click.prevent="onCardBackSubmit"
        >
          ดำเนินการต่อ
        </button>
      </div>
      <div class="container px-4 text-center">
        <input
          type="file"
          accept="image/*"
          id="card-back-retake"
          class="d-none"
          @input="onCardBackChanged"
        />
        <label
          for="card-back-retake"
          class="btn text-primary text-decoration-underline w-75"
        >
          ถ่ายใหม่
        </label>
      </div>
    </div>
  </div>
  <!-- Selfie - instruction -->
  <div v-else-if="state.mode === 'selfie-instruction'">
    <h2 class="text-primary fs-4 fw-bold mt-4">
      3. ถ่ายภาพคู่กับบัตรประชาชน (Selfie)
    </h2>
    <img
      src="@/assets/img/selfie.jpg"
      srcset="@/assets/img/selfie@2x.jpg 2x"
      class="d-block mx-auto my-4 img-fluid"
      alt="selfie"
    />
    <p class="text-primary">กรุณาตรวจสอบรูปถ่ายให้เป็นไปตามนี้:</p>
    <ol>
      <li>รูปถ่ายควรเป็น หน้าตรง เห็นใบหน้าเต็มและชัดเจน</li>
      <li>ไม่สวมแว่นตา หมวก หน้ากาก หรือมีสิ่งใดปิดบังใบหน้า</li>
      <li>
        ผู้ใช้งานถือบัตรประชาชนไม่บังใบหน้า
        และสามารถเห็นข้อมูลบนบัตรประชาชนได้อย่างชัดเจน
      </li>
    </ol>
    <div class="footer-content">
      <div class="container px-4 text-center">
        <input
          type="file"
          accept="image/*"
          id="card-back"
          class="d-none"
          @input="onSelfieChanged"
        />
        <label for="card-back" class="btn btn-green text-primary w-75">
          ดำเนินการต่อ
        </label>
      </div>
    </div>
  </div>
  <!-- Selfie - preview -->
  <div v-else-if="state.mode === 'selfie-preview'">
    <h2 class="text-primary fs-4 fw-bold mt-4">
      3. ถ่ายภาพคู่กับบัตรประชาชน (Selfie)
    </h2>
    <img
      :src="state.selfieImg"
      class="d-block mx-auto my-4 img-fluid"
      alt="selfie"
    />
    <div class="footer-content">
      <div class="container px-4 text-center mb-3">
        <button
          class="btn btn-green text-primary w-75"
          type="button"
          @click.prevent="onSubmit"
        >
          ดำเนินการต่อ
        </button>
      </div>
      <div class="container px-4 text-center">
        <input
          type="file"
          accept="image/*"
          id="card-back-retake"
          class="d-none"
          @input="onSelfieChanged"
        />
        <label
          for="card-back-retake"
          class="btn text-primary text-decoration-underline w-75"
        >
          ถ่ายใหม่
        </label>
      </div>
    </div>
  </div>

  <LoadingView v-if="!state.isLoaded" />
</template>
