import axios from 'axios'

export default {
  user: {
    login: (credentials) => axios.post('/api/user', credentials).then(res => res.data.user)
  }
}
