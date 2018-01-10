import {USER_LOGGED_IN, USER_LOGGED_OUT} from '../types'
import api from '../api'

export const userLoggedIn = (user) => ({
  type: USER_LOGGED_IN,
  user
})

export const userLoggedOut = () => ({
  type: USER_LOGGED_OUT
})

export const login = (credentials) => (dispatch) => api.user.login(credentials).then(user => {
  user = {
    email: user
  }
  localStorage.alohomoraLog = user.email
  dispatch(userLoggedIn(user))
})

export const logout = () => (dispatch) => {
  localStorage.removeItem('alohomoraLog')
  dispatch(userLoggedOut())
}