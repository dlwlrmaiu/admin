import axios from './../utils/axios.js'

export function fetchList() {
  return axios.request({
    url: 'banner',
    method: 'get'
  })
}