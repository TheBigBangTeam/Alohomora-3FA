import React, {Component} from 'react'
import axios from 'axios'
import {List, ListItem} from 'material-ui/List'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import ActionGrade from 'material-ui/svg-icons/action/grade'
import Avatar from 'material-ui/Avatar'
import {pinkA200, transparent} from 'material-ui/styles/colors'

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
            <MuiThemeProvider>
                <List>
                {this.state.users.map(user =>
                <ListItem
                    primaryText={user.name + " " + user.surname}
                    rightAvatar={<Avatar>{user.name[0]}</Avatar>}
                />
                )}
                </List>
            </MuiThemeProvider>
        )
    }
}

export default DeleteUserPage