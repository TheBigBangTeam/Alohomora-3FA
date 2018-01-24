import {USER_ELIMINATED} from '../types'
import api from '../api'

export const userEliminated = () => ({
    type: USER_ELIMINATED
})

export const deleteUser = (data) => (dispatch) => api.user.deleteUser(data).then((data) => {
    dispatch(userEliminated())
})