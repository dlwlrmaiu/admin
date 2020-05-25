import axios from 'axios'

// 封装axios
class httpRequset{
  constructor(baseUrl) {
    this.baseUrl = baseUrl
    // 处理请求队列
    this.queue = {}
  }
  // 设置更多的配置
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        // 请求头设置
        // 需要授权的API, 必须在请求头中使用 Authorization 字段提供 token令牌
        // Authorization: localStorage.getItem('token')
      }
    }
    return config
  }
  interceptors(instance) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 除开登录时,其他请求都要设置该请求头
      if(config.url !== 'login') {
        // 需要授权的API, 必须在请求头中使用 Authorization 字段提供 token令牌
        config.headers['Authorization'] = localStorage.getItem('token')
      }
      return config
    })
    // 响应拦截
    instance.interceptors.request.use(res => {
      // 处理config
      return res
    }, error => {
      // 请求出问题, 处理问题
      return { error: '网络出错' }
    })
  }
  request(options) {
    const instance = axios.create() // 创造实例对象
    // 合并配置
    // options = { baseURL: 'http://127.0.0.1:8888/api/private/v1/', url: 'login' }
    options = Object.assign(this.getInsideConfig(), options)
    //console.log(options) 
    this.interceptors(instance)
    return instance(options)
  }
}

const axiosObj = new httpRequset(process.env.VUE_APP_BASE_API) // /api/
export default axiosObj