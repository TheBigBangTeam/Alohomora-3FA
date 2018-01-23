import React, {Component} from 'react'
import axios from 'axios'

class DeleteUserPage extends Component {
    constructor (props) {
        super(props)
        this.state = {
            users: []
        }
    }

    componentDidMount(){
        axios.get('/api/admin/users', {
            'headers': {
                'Authorization' : 'Bearer ' + localStorage.alohomoraToken
              }
        }).then(({data}) => {
            var array = []
            for(var i = 0; i<data.users.length; i++) {
                array.push(data.users[i])
            }
            this.setState({
                users: array
            })
        })
    }

    render() {
        return(
            <div>
                <ul>
                {this.state.users.map(user =>
                <li key={user._id}>
                { user.name+ " - " + user.surname}
                </li>)}
                </ul>
            </div>
        )
    }
}

export default DeleteUserPage