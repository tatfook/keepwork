import axios from 'axios'

export const keepworkEndpoint = axios.create({
  baseURL: process.env.KEEPWORK_API_PREFIX
})

export const post = (...args) => keepworkEndpoint.post(...args).then(res => res.data.data)

// {
//   username: 'kaitlyn',
//   password: '123456'
// }
const login = (...args) => post('/user/login', ...args)

// Authorization `Bearer ${token}`
const getProfile = (...args) => post('/user/getProfile', ...args)

export const user = {
  login,
  getProfile
}

export const keepwork = {
  user
}

export default keepwork
