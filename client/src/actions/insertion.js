import api from '../api'

export const insertUser = (data) => () => api.user.insertUser(data)