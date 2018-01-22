import {USER_ELIMINATED} from '../types'
import api from '../api'

export const userEliminated = () => ({
    type: USER_ELIMINATED
})

export const deleteUser = (id) => (dispatch) => api.user.deleteUser(id).then((data) => {
    dispatch(userEliminated())
})