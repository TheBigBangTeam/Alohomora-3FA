import {USER_CREATED} from '../types'
import api from '../api'

export const userCreated = () => ({
    type: USER_CREATED
})

export const insertUser = (data) => (dispatch) => api.user.insertUser(data).then(data => {
    dispatch(userCreated())
})