export interface OtpRequest {
  username?: string
  name?: string
  surname?: string
  email?: string
  mobilePhone?: string
  agentCode?: string
  staffFlag?: string
}

export interface OtpResponse {
  refCode: string
}

export interface VerifyOtpRequest {
  otp: string
  otpRef: string
}
