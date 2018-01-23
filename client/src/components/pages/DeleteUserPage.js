import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import axios from 'axios'
import {List, ListItem} from 'material-ui/List'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'
import Avatar from 'material-ui/Avatar'
import {deleteUser} from '../../actions/deletion'

class DeleteUserPage extends Component {
    constructor (props) {
        super(props)
        this.state = {
            users: [],
            data: {}
        }
        this.handleSubmit = this.handleSubmit.bind(this)
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

    handleSubmit (e) {
        e.preventDefault()
        this.props.deleteUser(this.state.data).then(() => this.props.history.push('/dashboard'))
    }

    render() {
        return(
            <MuiThemeProvider>
                <List>
                {this.state.users.map(user =>
                <ListItem
                    key={user._id}
                    primaryText={user.name + " " + user.surname}
                    rightAvatar={<Avatar>{user.name[0]}</Avatar>}
                    onClick={() => {
                        var id2 = user._id.toString()
                        this.setState({
                            data: {...this.state.data, id: id2}
                        })
                    }}
                />
                )}
                </List>
                <RaisedButton
                    primary
                    type='submit'
                    className='submitButton'
                    disabled={!this.state.data.id}
                    label='Delete'
                    onClick={this.handleSubmit} 
                />
            </MuiThemeProvider>
        )
    }
}

DeleteUserPage.propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired,
    deleteUser: PropTypes.func.isRequired
  }

export default connect(null, {deleteUser})(DeleteUserPage)