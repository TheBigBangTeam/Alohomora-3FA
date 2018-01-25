import axios from 'axios'

export default {
  user: {
    login: (credentials) => axios.post('/api/user', credentials).then(res => res.data),
    insertUser: (data) => axios.post('/api/admin/users', data, {
      'headers': {
        'Authorization' : 'Bearer ' + localStorage.alohomoraToken
      }
    }).then(res => res.data),
    deleteUser: (data) => axios.delete('/api/admin/users/'+data.id, {
      'headers': {
        'Authorization' : 'Bearer ' + localStorage.alohomoraToken
      }
    }).then(res => res.data),
    modifyUser: (data) => axios.put('/api/admin/users/'+data.id, data, {
      'headers': {
        'Authorization' : 'Bearer ' + localStorage.alohomoraToken
      }
    }).then(res => res.data)
  }
}
