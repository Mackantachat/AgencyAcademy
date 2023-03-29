export interface CoursePaymentInfo {
  payerName: string // Name of Payer. Ex : คุณ ศักดิ์ดา ธรรมวิเศษ
  payeeName: string // Name of Payee. Ex : บริษั กรุงเทพประกันชีวิต จำกัด (มหาชน)
  remark: string
  expiredOn: Date // DateTime of expiration (Used for countdown)
  amount: number
  qrCodeUrl: string // URL for img src
}
