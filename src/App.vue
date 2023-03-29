<script setup lang="ts">
import { RouterView } from 'vue-router'

import HeaderView from '@/components/layouts/HeaderView.vue'

import { useAppModal } from '@/stores/TempStore'

const store = useAppModal()
</script>

<template>
  <HeaderView />
  <div class="page">
    <RouterView />
  </div>

  <div
    v-if="store.isModalOpened"
    class="modal fade show"
    id="messageModal"
    aria-modal="true"
    role="dialog"
    aria-labelledby="messageModalTitle"
    tabindex="-1"
    style="display: block"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="messageModalTitle">
            {{ store.modalTitle }}
          </h5>
          <button
            v-if="store.showCloseButton"
            type="button"
            class="btn-close"
            @click="() => store.closeModal()"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="#dc3545"
                class="bi bi-exclamation-triangle-fill"
                viewBox="0 0 16 16"
              >
                <path
                  d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
                />
              </svg>
            </div>
            <div class="col-10 px-4">
              {{ store.modalText }}
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div id="modalButtons"></div>
          <button
            v-if="store.showCloseButton"
            class="btn btn-green"
            @click="() => store.closeModal()"
          >
            {{ store.dismissButtonTitle }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
