import axios from 'axios'

export default {
  user: {
    login: (credentials) => axios.post('/api/user', credentials).then(res => res.data),
    insertUser: (data) => axios.post('/api/admin', data)
  }
}
