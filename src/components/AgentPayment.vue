<script setup lang="ts">
import { Field, Form } from 'vee-validate'
import * as Yup from 'yup'
import axios from 'axios'
import vSelect from 'vue-select'
import { useCartStore } from '@/stores/cart'
import Icon from '@/components/icons/Index.vue'
import WarningIcon from '@/components/icons/Warning.vue'
import FullModal from '@/components/FullModal.vue'
import CloseButton from '@/components/CloseButton.vue'
import QRPaymentInstruction from '@/components/QRPaymentInstruction.vue'
import { numberWithCommas } from '@/Helpers'

const schema = Yup.object().shape({
  category: Yup.string().required('กรุณาเลือกหมวดหมู่'),
  email: Yup.string()
    .required(
      'กรุณาระบุอีเมลเพื่อนำส่งใบเสร็จรับเงิน (อีเมลจะถูกบันทึกในระบบ smart agent เพื่อใช้ในการติดต่อ)'
    )
    .email('อีเมลไม่ถูกต้อง'),
  price: Yup.number().required().min(1)
})
</script>
<template>
  <Form
    @submit="handleSubmit"
    :validation-schema="schema"
    v-slot="{ errors, meta }"
  >
    <div class="row g-3">
      <div class="col-12">
        <label for="category">หมวดหมู่</label>
        <Field name="category">
          <v-select
            name="category"
            id="category"
            :options="categoryOptions"
            :reduce="(category: any) => category.id"
            label="name"
            :searchable="false"
            :clearable="false"
            v-model="values.category"
            placeholder="เลือกหมวดหมู่"
          ></v-select>
        </Field>
        <Field
          name="category"
          type="hidden"
          class="form-control"
          v-model="values.category"
          id="category"
          :class="{ 'is-invalid': errors.category }"
          :validate-on-input="true"
        />
        <div class="invalid-feedback" v-if="errors.category">
          {{ errors.category }}
        </div>
      </div>
      <div class="col-12" v-if="subCategoryOptions.length">
        <label for="subCategory">{{ subCategoryLabel }}</label>
        <Field name="subCategory">
          <v-select
            name="subCategory"
            id="subCategory"
            :options="subCategoryOptions"
            :reduce="(category: any) => category.id"
            label="name"
            :searchable="false"
            :clearable="false"
            v-model="values.subCategory"
            :placeholder="`เลือก${subCategoryLabel}`"
          ></v-select>
        </Field>
        <Field
          name="subCategory"
          type="hidden"
          class="form-control"
          v-model="values.subCategory"
          id="subCategory"
          :class="{ 'is-invalid': errors.subCategory }"
          :validate-on-input="true"
        />
        <div class="invalid-feedback" v-if="errors.subCategory">
          {{ errors.subCategory }} p
        </div>
      </div>
      <div class="col-12" v-if="childCategoryOptions.length">
        <label for="childCategory">{{ childCategoryLabel }}</label>
        <Field name="childCategory">
          <v-select
            name="childCategory"
            id="childCategory"
            :options="childCategoryOptions"
            :reduce="(category: any) => category.id"
            label="name"
            :searchable="false"
            :clearable="false"
            v-model="values.childCategory"
            :placeholder="`เลือก${childCategoryLabel}`"
          ></v-select>
        </Field>
        <Field
          name="childCategory"
          type="hidden"
          class="form-control"
          v-model="values.childCategory"
          id="childCategory"
          :class="{ 'is-invalid': errors.childCategory }"
          :validate-on-input="true"
        />
        <div class="invalid-feedback" v-if="errors.childCategory">
          {{ errors.childCategory }}
        </div>
      </div>
      <div class="col-12">
        <label for="email">อีเมล</label>
        <Field
          name="email"
          type="email"
          class="form-control"
          v-model="values.email"
          id="email"
          :class="{ 'is-invalid': errors.email }"
          :validate-on-input="true"
        />
        <div class="invalid-feedback" v-if="errors.email">
          {{ errors.email }}
        </div>
      </div>
    </div>
    <div class="footer-content">
      <div class="container px-4 text-center mb-2">
        <p class="text-center fs-5 m-0">จำนวนเงินที่ต้องชำระ</p>
        <p class="text-center text-primary fs-4 fw-bold">
          {{ numberWithCommas(price) }} บาท
        </p>
        <Field
          name="price"
          type="hidden"
          class="form-control"
          v-model="price"
          id="price"
          :class="{ 'is-invalid': errors.price }"
          :validate-on-input="true"
        />
      </div>
      <div class="container px-4 text-center mb-2">
        <button
          class="btn text-primary w-75"
          :class="{
            'disable btn-gray': !meta.valid,
            'btn-green': meta.valid
          }"
          :disabled="!meta.valid"
        >
          ดำเนินการต่อ
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
  </Form>

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

  <!-- <Loading v-if="!isLoaded" /> -->
</template>

<script lang="ts">
const categoryOptions: any[] = []
const subCategoryOptions: any[] = []
const childCategoryOptions: any[] = []
export default {
  props: {
    isModal: {
      type: Boolean,
      default: false
    },
    closeFn: {
      type: Function,
      default: null
    }
  },
  components: {
    Form,
    Field,
    'v-select': vSelect
  },
  data() {
    return {
      values: {
        category: '',
        subCategory: '',
        childCategory: '',
        email: ''
      },
      categoryOptions,
      subCategoryLabel: '',
      subCategoryOptions,
      childCategoryLabel: '',
      childCategoryOptions,
      isLoaded: false,
      isPaymentInsOpened: false,
      price: 0,
      selectedItem: null
    }
  },
  async created() {
    const _vm = this
    const res = await axios.get(`/api/v1/categories`)
    if (res.data) {
      _vm.categoryOptions = res.data
    }
    _vm.isLoaded = true
  },
  methods: {
    handleSubmit(values: any) {
      const _vm = this
      _vm.isLoaded = false
      axios
        .post(`/api/v1/verify`, values)
        .then((res) => {
          if (res.data.status === true) {
            const cart = useCartStore()
            cart.addToCart(this.selectedItem)
            if (!_vm.isModal) {
              _vm.$router.push({ name: 'AgentPaymentCart' })
            } else {
              _vm.isLoaded = true
              _vm.closeFn()
            }
          }
        })
        .catch((err) => {
          _vm.isLoaded = true
        })
    }
  },
  computed: {
    category() {
      return this.values.category
    },
    subCategory() {
      return this.values.subCategory
    },
    childCategory() {
      return this.values.childCategory
    }
  },
  watch: {
    category(val) {
      const _vm = this
      const res = _vm.categoryOptions.find((x) => x.id === val)
      if (res) {
        if (res.price) {
          _vm.selectedItem = res
          _vm.price = res.price
          return
        }
        if (res.children && res.children_label) {
          _vm.subCategoryLabel = res.children_label
          _vm.subCategoryOptions = res.children
          _vm.childCategoryLabel = ''
          _vm.childCategoryOptions = []
        } else {
          _vm.subCategoryLabel = ''
          _vm.subCategoryOptions = []
          _vm.childCategoryLabel = ''
          _vm.childCategoryOptions = []
        }
        _vm.values.subCategory = ''
        _vm.values.childCategory = ''
        _vm.selectedItem = null
        _vm.price = 0
      }
    },
    subCategory(val) {
      const _vm = this
      const res = _vm.subCategoryOptions.find((x) => x.id === val)
      if (res) {
        if (res.price) {
          _vm.selectedItem = res
          _vm.price = res.price
          return
        }
        if (res.children && res.children_label) {
          _vm.childCategoryLabel = res.children_label
          _vm.childCategoryOptions = res.children
        } else {
          _vm.childCategoryLabel = ''
          _vm.childCategoryOptions = []
        }
        _vm.values.childCategory = ''
        _vm.selectedItem = null
        _vm.price = 0
      }
    },
    childCategory(val) {
      const _vm = this
      const res = _vm.childCategoryOptions.find((x) => x.id === val)
      if (res) {
        if (res.price) {
          _vm.selectedItem = res
          _vm.price = res.price
          return
        }
      }
      _vm.selectedItem = null
    }
  }
}
</script>
