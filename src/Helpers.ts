export const readFileContent = (
  f: Blob
): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(f)
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  })
}

export const numberWithCommas = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const getStatus = (val: string) => {
  let txt
  switch (val) {
    case 'paid':
      txt = 'ชำระเงินแล้ว'
      break
    case 'pending':
      txt = 'รอการชำระเงิน'
      break
    case 'not_paid':
      txt = 'จองไม่สำเร็จ (ไม่ได้ชำระเงิน)'
      break
    case 'canceled':
      txt = 'ยกเลิก (โดยผู้ลงทะเบียน)'
      break
    case 'canceled_by_company':
      txt = 'ยกเลิก (โดยบริษัท)'
      break
    case 'failed':
      txt = 'ไม่ผ่านการอบรม / สอบ'
      break
    case 'absented':
      txt = 'ขาดการอบรม / สอบ'
      break
    default:
      txt = 'ยังไม่ได้จอง'
  }
  return txt
}
