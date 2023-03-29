import { defineStore } from 'pinia'

interface TempStore {
  isModalOpened: boolean
  showCloseButton: boolean
  modalTitle?: string
  modalText?: string
  dismissButtonTitle?: string
}

export const useAppModal = defineStore('TempStore', {
  state: (): TempStore => ({
    isModalOpened: false,
    showCloseButton: true,
    modalTitle: undefined,
    modalText: undefined,
    dismissButtonTitle: 'ปิด'
  }),

  actions: {
    // Actions.
    openModal(title: string, text: string, preventClose?: boolean) {
      this.isModalOpened = true
      this.modalTitle = title
      this.modalText = text
      if (preventClose) {
        this.showCloseButton = false
      }
    },

    closeModal() {
      this.isModalOpened = false
      this.showCloseButton = true
      this.modalTitle = undefined
      this.modalText = undefined
      this.dismissButtonTitle = 'ปิด'
    }
  }
})
