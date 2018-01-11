import {USER_LOGGED_IN, USER_LOGGED_OUT} from '../types'
import api from '../api'

export const userLoggedIn = (user) => ({
  type: USER_LOGGED_IN,
  user
})

export const userLoggedOut = () => ({
  type: USER_LOGGED_OUT
})

export const login = (credentials) => (dispatch) => api.user.login(credentials).then((data) => {
  localStorage.alohomoraLog = JSON.stringify(data.user)
  localStorage.alohomoraToken = data.token
  dispatch(userLoggedIn(data))
})

export const logout = () => (dispatch) => {
  localStorage.removeItem('alohomoraLog')
  localStorage.removeItem('alohomoraToken')
  dispatch(userLoggedOut())
}
