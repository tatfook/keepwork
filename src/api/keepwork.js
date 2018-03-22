import axios from 'axios'

export const keepworkEndpoint = axios.create({
  baseURL: process.env.KEEPWORK_API_PREFIX
})

export const post = (...args) => keepworkEndpoint.post(...args).then(res => res.data.data)

export const user = {
  login: (...args) => post('/user/login', ...args),
  getProfile: (...args) => post('/user/getProfile', ...args)
}

export const website = {
  getAllByUsername: (...args) => post('website/getAllByUsername', ...args)
}

export const siteDataSource = {
  getByUsername: (...args) => post('site_data_source/getByUsername', ...args)
}

export const keepwork = {
  user,
  website,
  siteDataSource
}

export default keepwork
