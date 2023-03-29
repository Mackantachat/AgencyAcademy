import type {
  AcademyTraining,
  AgentProfile,
  IdCardInfo,
  NewsBanner,
  OtpRequest,
  OtpResponse,
  RegisterUserRequest,
  TrainingStatus,
  VerifyOtpRequest
} from '@/types'
import type { CoursePaymentInfo } from '@/types/CoursePaymentInfo'
import moment from 'moment'
import { apiAnonymous, apiWithToken } from './ApiHelpers'
import orders from '@/data/orders'
import type { UserProfile } from '@/types/UserProfile'

const API_PREFIX = '/AgentAcademy'
const ACCESS_TOKEN_KEY = 'accessToken'
const USER_NAME_KEY = 'user'

//#region  Access Token
export const setAccessToken = (token: string, userid: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
  localStorage.setItem(USER_NAME_KEY, userid)
}

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export const clearAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(USER_NAME_KEY)
}

export const getCurrentUserid = () => {
  return localStorage.getItem(USER_NAME_KEY)
}

export const validateAccessToken = async (
  token: string
): Promise<any[] | undefined> => {
  console.log('validate token', token)
  const response = await apiAnonymous('GET', `${API_PREFIX}/VerifyToken`, {
    Token: token
  })
  if (response.ok) {
    return await response.json()
  } else {
    await handleApiError(response)
  }
}

//#endregion

//#region Home view
export const listNewsBanners = async (): Promise<NewsBanner[] | undefined> => {
  const response = await apiWithToken('GET', `${API_PREFIX}/GetBanner`)
  if (response.ok) {
    return await response.json()
  } else {
    await handleApiError(response)
  }
}
//#endregion

//#region New user registration
export const getCardInfoOCR = async (
  cardFrontUri: string,
  cardBackUri: string
): Promise<IdCardInfo | undefined> => {
  const params = {
    imageIDCardFront: cardFrontUri,
    imageIDCardBack: cardBackUri
  }

  const response = await apiWithToken(
    'POST',
    `${API_PREFIX}/GetOCRIDCard`,
    params
  )

  if (response.ok) {
    const result = await response.json()
    // Format
    console.log('OCR result', result)

    return {
      name: result?.name,
      surname: result?.surname,
      birthDateText: result?.birthDate,
      birthDate: moment(result.iso_birthDate, 'DDMMYYYY').format('YYYY-MM-DD'),
      idcard: result.idcard ? result.idcard.replace(/\s/g, '') : '',
      laserNo: result.laserNo ? result.laserNo.replace(/-/g, '') : ''
    }
    // return result
  } else {
    await handleApiError(response)
  }
  return undefined
}

export const isStaffID = async (idNo: string) => {
  const response = await apiWithToken(
    'POST',
    `${API_PREFIX}/CheckDataStaff?IdCard=${idNo}`
  )

  if (response.ok) {
    const result = await response.json()
    // There is no result returned from api
    console.log('check staff ... OK', result)
    return result?.staffFlag === 'Y'
  } else {
    await handleApiError(response)
  }
  return false
}

export const verifyUserInfo = async (cardInfo: IdCardInfo) => {
  // API accept date in format : YYYYMMDD (Year in Budhist Century)
  const dateVal = moment(cardInfo?.birthDate)
  cardInfo.birthDate = `${dateVal.get('years') + 543}${dateVal.format('MMDD')}`
  cardInfo.idcard = cardInfo.idcard.replace(/-/g, '')
  cardInfo.laserNo = cardInfo.laserNo.replace(/-/g, '')

  const response = await apiWithToken(
    'POST',
    `${API_PREFIX}/CheckDOPA`,
    cardInfo
  )

  if (response.ok) {
    // There is no result returned from api
    console.log('verify DOPA ... OK')
    return true
  } else {
    await handleApiError(response)
  }
  return false
}

export const searchAgent = async (
  search: string
): Promise<AgentProfile[] | undefined> => {
  const response = await apiWithToken(
    'GET',
    `${API_PREFIX}/GetDataAgent?agentSearch=${search}&limitResource=10`
  )
  if (response.ok) {
    return await response.json()
  } else {
    await handleApiError(response)
  }
  return undefined
}

export const validateUserName = async (userName: string): Promise<boolean> => {
  const response = await apiWithToken('POST', `${API_PREFIX}/CheckUsername`, {
    username: userName
  })
  if (response.ok) {
    return true
  } else {
    await handleApiError(response)
  }
  return false
}

export const requestRegisterOtp = async (
  req: OtpRequest
): Promise<OtpResponse | undefined> => {
  const response = await apiWithToken(
    'POST',
    `${API_PREFIX}/SendEmailRegistrationOTP`,
    { ...req, flg: 0 }
  )
  if (response.ok) {
    const result = await response.json()
    return result
  } else {
    await handleApiError(response)
  }
  return undefined
}

export const verifyRegisterOtp = async (
  req: VerifyOtpRequest
): Promise<boolean> => {
  const response = await apiWithToken(
    'POST',
    `${API_PREFIX}/VerifyEmailRegistrationOTP`,
    req
  )
  if (response.ok) {
    return true
  } else {
    await handleApiError(response)
  }
  return false
}

export const registerUser = async (
  req: RegisterUserRequest
): Promise<boolean> => {
  const response = await apiWithToken(
    'POST',
    `${API_PREFIX}/RegistrationUser`,
    req
  )
  if (response.ok) {
    return true
  } else {
    await handleApiError(response)
  }
  return false
}
//#endregion

//#region Training Courses

// List trainings by query
export const listTrainings = async (query: {
  searchText?: string
}): Promise<AcademyTraining[] | undefined> => {
  const { searchText } = query
  const response = await apiWithToken(
    'GET',
    `${API_PREFIX}/GetDataTrainingSchedule?searchText=${searchText}`
  )
  if (response.ok) {
    return await response.json()
  }
  return undefined
}

export const fetchTraining = async (
  id: string
): Promise<AcademyTraining | undefined> => {
  const response = await apiWithToken(
    'GET',
    `${API_PREFIX}/GetDataTrainingScheduleID?TrainingID=${id}`
  )
  if (response.ok) {
    const obj = await response.json()
    if (obj.length > 0) {
      // Temp fix because of typo from api
      const ret = {
        ...obj[0],
        trainingModelCode: obj[0].trainingModel_code
      }
      console.log('fetch result', ret)
      return ret
    }
  } else {
    await handleApiError(response)
  }
  return undefined
}

export const fetchTrainingHistory = async (
  id: string
): Promise<AcademyTraining | undefined> => {
  const response = await apiWithToken(
    'GET',
    `${API_PREFIX}/GetDataTrainingHistoryID?TrainingID=${id}`
  )
  if (response.ok) {
    const obj = await response.json()
    if (obj.length > 0) {
      // Temp fix because of typo from api
      const ret = {
        ...obj[0],
        trainingModelCode: obj[0].trainingModel_code
      }
      console.log('fetch result', ret)
      return ret
    }
  } else {
    await handleApiError(response)
  }
  return undefined
}

// List training history by query
export const listTrainingHistory = async (query: {
  searchText?: string
  status?: string
}): Promise<AcademyTraining[] | undefined> => {
  const { searchText, status } = query
  const response = await apiWithToken(
    'POST',
    `${API_PREFIX}/GetDataTrainingHistory?searchText=${
      searchText || ''
    }&statusCode=${status || ''}`
  )
  if (response.ok) {
    try {
      return await response.json()
    } catch (error) {
      console.log('list training history return empty content !!')
      return []
    }
  } else {
    await handleApiError(response)
  }
  return undefined
}

// Apply for training course
export const applyTraining = async (trainingId: string) => {
  const username = getCurrentUserid()
  const response = await apiWithToken(
    'POST',
    `${API_PREFIX}/RegistrationTrainingSchedule`,
    {
      trainingScheduleID: trainingId,
      username
    }
  )
  if (response.ok) {
    return true
  } else {
    await handleApiError(response)
  }
  return false
}

// Cancel training application
export const cancelApplication = async (trainingId: string) => {
  const response = await apiWithToken(
    'POST',
    `${API_PREFIX}/Cancel_Reservation?data=${trainingId}`
  )
  if (response.ok) {
    const result = await response.json()
    return result
  } else {
    await handleApiError(response)
  }
  return undefined
}

// Payment QR Code.
export const fetchPaymentInfo = async (
  id: string
): Promise<CoursePaymentInfo> => {
  // const response = await apiWithToken(
  //   'POST',
  //   `${API_PREFIX}/paymentInfo?id=${trainingId}`
  // )

  // const result = await response.json()

  const result = Promise.resolve({
    payerName: 'คุณ ศักดิ์ดา ธรรมวิเศษ',
    payeeName: 'บริษัท กรุงเทพประกันชีวิต จำกัด (มหาชน)',
    remark: 'ลงทะเบียนอบรม หลักสูตรอบรมสอบใบอนุญาตเป็นตัวแทนประกันชีวิต (E-A)',
    expiredOn: new Date(),
    amount: 100,
    qrCodeUrl: `https://chart.googleapis.com/chart?chs=500x500&chld=L|0&cht=qr&chl=${id}&choe=UTF-8`
  })

  return result
}

// List training status
export const listTrainingStatus = async (): Promise<
  TrainingStatus[] | undefined
> => {
  const response = await apiWithToken(
    'GET',
    `${API_PREFIX}/GetDataTrainingStatus`
  )
  if (response.ok) {
    const result = await response.json()
    return result
  } else {
    await handleApiError(response)
  }
  return undefined
}
//#endregion

//#region Pending orders
export const listPendingOrders = async (): Promise<any[] | undefined> => {
  // const response = await apiWithToken('GET', `${API_PREFIX}/GetPendingOrders`)
  // if (response.ok) {
  //   return await response.json()
  // } else {
  //   await handleApiError(response)
  // }
  return orders
}

//#endregion

const handleApiError = async (response: Response) => {
  console.log('api error')
  const result = await response.json()
  if (result.errorMessage) {
    throw new Error(result.errorMessage)
  } else {
    throw new Error('มีข้อผิดพลาด โปรดลองใหม่ภายหลัง')
  }
}
