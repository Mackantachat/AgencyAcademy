import type { IdCardInfo, RegisterInfo } from '@/types'
import { defineStore } from 'pinia'

const regex = /data:([-\w]+\/[-+\w.]+)?(;base64)?,(.*)/

interface RegisterStore {
  cardFrontImg?: string
  cardBackImg?: string
  selfieImg?: string
  isStaff?: boolean
  idInfo?: IdCardInfo
  registerInfo?: RegisterInfo
}

export const useRegisterStore = defineStore('RegisterStore', {
  // state
  state: (): RegisterStore => ({
    cardFrontImg: undefined,
    cardBackImg: undefined,
    selfieImg: undefined,
    idInfo: undefined,
    registerInfo: undefined,
    isStaff: undefined
  }),

  // getters
  getters: {
    // Register OTP Request
    otpRequest(state) {
      return {
        userName: state.registerInfo?.username,
        name: state.idInfo?.name,
        surname: state.idInfo?.surname,
        email: state.registerInfo?.email,
        mobilePhone: state.registerInfo?.mobile,
        agentCode: state.registerInfo?.agentCode,
        staffFlag: state.isStaff ? 'Y' : 'N'
      }
    },
    // Register request
    registerRequest(state) {
      let imageIDCardFront = state.cardFrontImg
      let imageSelfie = state.selfieImg
      let contentTypeIDCard = ''
      let contentTypeSelfie = ''

      // Remove prefix before comma from data: Ex. 'data:image/jpeg;base64,'
      if (state.cardFrontImg) {
        const matched = state.cardFrontImg.match(regex)
        console.log('regex matched', matched)
        if (matched) {
          contentTypeIDCard = matched[1]
          imageIDCardFront = matched[3]
        }
      }

      if (state.selfieImg) {
        const matched = state.selfieImg.match(regex)
        console.log('regex matched', matched)
        if (matched) {
          contentTypeSelfie = matched[1]
          imageSelfie = matched[3]
        }
      }
      return {
        ...state.idInfo,
        ...state.registerInfo,
        imageIDCardFront,
        imageSelfie,
        contentTypeIDCard,
        contentTypeSelfie
      }
    }
  }
})
