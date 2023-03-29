import moment from 'moment'
import { getAccessToken } from './AcademyService'
const AUTH_TOKEN_TYPE = 'Bearer'
const apiServer = import.meta.env.VITE_API_BASE_URL

const appCustomHeader = (info?: any) => {
  const customInfo = {}

  if (info) {
    return JSON.stringify({ ...customInfo, ...info })
  }

  return JSON.stringify(customInfo)
}

export const encodeFormBody = (method: string, obj: any, headers: any = {}) => {
  const formBodyArray = [] as string[]
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const encodedKey = encodeURIComponent(key)
      const val = obj[key]
      const encodedValue =
        val instanceof Date
          ? encodeURIComponent(moment(val).utc().format())
          : encodeURIComponent(obj[key])
      formBodyArray.push(encodedKey + '=' + encodedValue)
    }
  }
  const formBody = formBodyArray.join('&')
  return {
    method,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      ...headers
    },
    body: formBody
  }
}

export const apiAnonymous = (
  method: string,
  path: string,
  headers?: any,
  params?: any
) => {
  if (params) {
    console.log('api server', apiServer)
    return fetch(apiServer + path, {
      method,
      headers,
      body: JSON.stringify(params)
    })
  } else {
    console.log('api server', apiServer)
    return fetch(apiServer + path, { method, headers })
  }
}

export const apiWithToken = (
  method: string,
  path: string,
  params?: any,
  info?: any
) => {
  console.log(`api ${method} with token`, path, params)
  console.log(`api ${method} with token headers`, appCustomHeader(info))
  const token = getAccessToken()
  const headers = {
    authorization: `${AUTH_TOKEN_TYPE} ${token}`,
    'Content-Type': `application/json`,
    'X-Academy': appCustomHeader(info)
  }
  if (params) {
    // return fetch(path, encodeFormBody(method, params, headers))
    return fetch(apiServer + path, {
      headers,
      method,
      body: JSON.stringify(params)
    })
  } else {
    return fetch(apiServer + path, { method, headers })
  }
}

export const apiMultipartWithToken = (
  path: string,
  params?: any,
  imageUriList?: string[],
  info?: any
) => {
  const customHeaders = appCustomHeader(info)
  const token = getAccessToken()
  console.log('api multpart', path, params, imageUriList, customHeaders)
  const headers = {
    authorization: `${AUTH_TOKEN_TYPE} ${token}`,
    'X-Academy': customHeaders
  }

  const data = new FormData()
  //   if (imageUriList) {
  //     imageUriList.forEach((item, i) => {
  //       data.append('files', {
  //         name: `file-${i}.jpg`,
  //         type: 'image/jpeg',
  //         uri: item
  //       })
  //     })
  //   }

  if (params) {
    data.append('params', JSON.stringify(params))
  }

  return fetch(apiServer + path, {
    headers,
    method: 'POST',
    body: data
  })
}
