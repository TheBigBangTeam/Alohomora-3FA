import {USER_MODIFIED} from '../types'
import api from '../api'

export const userModified = () => ({
    type: USER_MODIFIED
})

export const modifyUser = (data) => (dispatch) => api.user.modifyUser(data).then((data) => {
    dispatch(userModified())
})