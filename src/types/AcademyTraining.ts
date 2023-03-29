export interface AcademyTraining {
  trainingScheduleID: string
  courseTitle: string
  courseTitleShort: string
  trainingModel?: string
  trainingModelCode?: string
  trainingDateTime?: string
  trainingStatus?: string
  totalSeat: number
  seat: number
  referenceAgentCodeFlag?: string
  remark?: string

  time?: string
  price?: string
  admissionPeriod: string
  qualifications?: { qualification: string }[]
  listLecturer?: { lecturerName: string }[]
  listPrerequisite?: { preRequisiteName: string }[]

  duration?: string
  paymentFlag?: string
  canCancel?: string
  canRegister?: string
}
