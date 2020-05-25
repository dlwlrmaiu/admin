import axios from '@/utils/axios'

export function fetchEchartsOption() {
  return axios.request({
    url: 'reports/type/1',
    method: 'get'
  })
}