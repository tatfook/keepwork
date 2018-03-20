import axios from 'axios'

export const keepworkEndpoint = axios.create({
  baseURL: process.env.KEEPWORK_API_PREFIX
})

export const post = (...args) => keepworkEndpoint.post(...args).then(res => res.data.data)

// {
//   username: 'kaitlyn',
//   password: '123456'
// }
export const login = (params) => post('/user/login', params)

export const user = {
  login
}

export const keepwork = {
  user
}

export default keepwork
