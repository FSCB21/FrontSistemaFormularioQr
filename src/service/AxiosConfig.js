import axios from "axios";

axios.defaults.headers.common['token-login'] = localStorage.getItem('token-login')

let evitar = 0

axios.interceptors.response.use(config=>{
    axios.defaults.headers.common['token-login'] = localStorage.getItem('token-login')
    return config;
  }, err=> {
    console.log(err.response.data)

    if ((err.response.status === 401 || err.response.status === 408) && evitar === 0) {
      localStorage.removeItem('token')
      alert(err.response.data.error)
      window.location.href = '/#/login';
      window.location.reload()
      evitar = 1
    }
    return Promise.reject(err)
  });