import axios from './../utils/axios.js'

export function fetchLogin(data) {
  return axios.request({
    url: 'login',
    method: 'post',
    data
  })
}