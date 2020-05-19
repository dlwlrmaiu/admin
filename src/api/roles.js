import axios from '@/utils/axios'

export function fetchAddRole(data) {
  return axios.request({
    url: 'roles',
    method: 'post',
    data
  })
}