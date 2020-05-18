import axios from '@/utils/axios.js'

export function fetchRightsList(type) {
  return axios.request({
    url: `rights/${type}`,
    method: 'get'
  })
}