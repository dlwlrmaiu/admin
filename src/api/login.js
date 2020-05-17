import axios from './../utils/axios.js'

export function fetchLogin(data) {
  console.log('1111')
  return axios.request({
    url: '/login',
    method: 'post',
    data
  })
}