import axios from '@/utils/axios.js'

export function fetchUsersList(data) {
  return axios.request({
    url: 'users',
    method: 'get',
    params: data
  })  
}