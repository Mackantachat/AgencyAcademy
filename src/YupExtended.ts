import * as Yup from 'yup'
import type { AnyObject, Maybe } from 'yup/lib/types'
import { validateUserName } from './services/AcademyService'

Yup.addMethod<Yup.StringSchema>(
  Yup.string,
  'referralValidate',
  function referralValidate(message: any) {
    return this.test('referralValidate', message, function (value: any) {
      const { path, createError } = this
      const newVal = value?.replace(/\s/g, '')
      const isNum = /^\d+$/.test(newVal)
      if (isNum) {
        if (newVal.length !== 8) {
          return createError({
            path,
            message:
              message ?? 'กรุณาระบุรหัสตัวแทนอ้่างอิง (หน่วย) ให้ครบ 8 หลัก'
          })
        }
      } else {
        if (value && newVal.length < 3) {
          return createError({
            path,
            message: message ?? 'กรุณาระบุอย่างน้อย 3 ตัวอักษร'
          })
        }
      }
      return true
    })
  }
)

Yup.addMethod<Yup.StringSchema>(
  Yup.string,
  'idNumberValidation',
  function idNumberValidation(message: string) {
    return this.test('idNumberValidation', message, function (value: any) {
      const { path, createError } = this
      const newVal = value.replace(/-/g, '')
      if (!newVal) {
        return createError({
          path,
          message: message ?? 'กรุณาระบุเลขประจำตัวประชาชน'
        })
      }
      if (newVal.length < 13) {
        return createError({
          path,
          message: message ?? 'กรุณาระบุเลขประจำตัวประชาชนให้ครบถ้วน'
        })
      }
      if (!checkIdNumber(newVal)) {
        return createError({
          path,
          message: message ?? 'เลขประจำตัวประชาชนไม่ถูกต้อง'
        })
      }
      return true
    })
  }
)

Yup.addMethod<Yup.StringSchema>(
  Yup.string,
  'userNameValidation',
  function userNameValidation(message: string) {
    return this.test('validateUserName', message, async function (value: any) {
      const { path, createError } = this
      try {
        const ok = await validateUserName(value)
        return ok
      } catch (error) {
        if (error instanceof Error) {
          return createError({
            path,
            message: error.message
          })
        }
      }
      return false
    })
  }
)

function checkIdNumber(value: any) {
  if (value.substring(0, 1) == 0) return false
  if (value.length != 13) return false
  let i, sum
  for (i = 0, sum = 0; i < 12; i++)
    sum += parseFloat(value.charAt(i)) * (13 - i)
  if ((11 - (sum % 11)) % 10 != parseFloat(value.charAt(12))) return false
  return true
}

declare module 'yup' {
  interface StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType
  > extends Yup.BaseSchema<TType, TContext, TOut> {
    referralValidate(): StringSchema<TType, TContext>
    idNumberValidation(): StringSchema<TType, TContext>
    userNameValidation(): StringSchema<TType, TContext>
  }
}

export default Yup
