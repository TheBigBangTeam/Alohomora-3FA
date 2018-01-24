import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import axios from 'axios'
import {List, ListItem} from 'material-ui/List'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'
import Avatar from 'material-ui/Avatar'
import TextField from 'material-ui/TextField'
import {modifyUser} from '../../actions/modification'

class ModifyUserPage extends Component {

    constructor (props) {
        super(props)
        this.state = {
            users: [],
            data: {},
            errors: {}
        }
        this.handleChange = this.handleChange.bind(this)
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

    handleChange (e) {
        let value
        switch (e.target.name) {
          case 'username':
            value = e.target.value.trim()
            break;
          case 'privileges':
            value = e.target.value.split(" ")
            break;
          default:
            value = e.target.value
            break;
        }
        this.setState({
          data: {...this.state.data, [e.target.name]: value}
        })
    }

    validate (data) {
        const errors = {}
        if (!data.name) errors.name = 'Missing name'
        if (!data.surname) errors.surname = 'Missing surname'
        if (!data.email) errors.email = 'Missing email'
        if (!data.rfidTag) errors.rfidTag = 'Missing rfidTag'
        if (!data.pin) errors.pin = 'Missing PIN'
        if (!data.username) errors.username = 'Missing username'
        if (!data.password) errors.password = 'Missing password'
        return errors
      }

    handleSubmit (e) {
        e.preventDefault()
        const errors = this.validate(this.state.data)
        this.setState({ errors })
        if (Object.keys(errors).length === 0) {
            this.props.modifyUser(this.state.data).then(() => this.props.history.push('/dashboard'))
        }
    }

    render() {
        return(
            <MuiThemeProvider>
                <div>
                    <font face="Roboto">
                    <h2>Select a user</h2>
                    </font>
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
                    <br />
                    <br />
                    <div style={styles.general} hidden={!this.state.data.id}>
                        <font face="Roboto">
                        <h2>Modify the user</h2>
                        </font>
                        <form>
                            <TextField
                            style={styles.textField}
                            floatingLabelText='Name'
                            errorText={this.state.errors.name}
                            name='name'
                            type='text'
                            hintText='Enter the name'
                            onChange={this.handleChange} />
                            <br />
                            <TextField
                            style={styles.textField}
                            floatingLabelText='Surname'
                            errorText={this.state.errors.surname}
                            name='surname'
                            type='text'
                            hintText='Enter the surname'
                            onChange={this.handleChange} />
                            <br />
                            <TextField
                            style={styles.textField}
                            floatingLabelText='Email'
                            errorText={this.state.errors.email}
                            name='email'
                            type='email'
                            hintText='Enter the email'
                            onChange={this.handleChange} />
                            <br />
                            <TextField
                            style={styles.textField}
                            floatingLabelText='Privileges'
                            errorText={this.state.errors.privileges}
                            name='privileges'
                            type='text'
                            hintText='Enter the privileges'
                            onChange={this.handleChange} />
                            <br />
                            <TextField
                            style={styles.textField}
                            floatingLabelText='Tag RFID'
                            errorText={this.state.errors.rfidTag}
                            name='rfidTag'
                            type='text'
                            hintText='Enter the RFID tag'
                            onChange={this.handleChange} />
                            <br />
                            <TextField
                            style={styles.textField}
                            floatingLabelText='PIN'
                            errorText={this.state.errors.pin}
                            name='pin'
                            type='text'
                            hintText='Enter the PIN'
                            onChange={this.handleChange} />
                            <br />
                            <TextField
                            style={styles.textField}
                            floatingLabelText='Username'
                            errorText={this.state.errors.username}
                            name='username'
                            type='text'
                            hintText='Enter your username'
                            onChange={this.handleChange} />
                            <br />
                            <TextField floatingLabelText='Password'
                            style={styles.textField}
                            errorText={this.state.errors.password}
                            name='password'
                            type='password'
                            hintText='Enter your password'
                            onChange={this.handleChange} />
                            <br />
                            <RaisedButton
                            primary
                            style={styles.submitButton}
                            type='submit'
                            className='submitButton'
                            disabled={!(
                                !!this.state.name ||
                                !!this.state.username ||
                                !!this.state.email ||
                                !!this.state.rfidTag ||
                                !!this.state.pin ||
                                !!this.state.data.username ||
                                !!this.state.data.password
                                )}
                            label='Modify'
                            onClick={this.handleSubmit} />
                        </form>
                    </div>
                </div>
            </MuiThemeProvider>
        )
    }
}

const styles = {
    general: {
      marginTop: '60px',
      textAlign: 'center'
    },
    submitButton: {
      margin: '15px'
    },
    textField: {
      width: '400px'
    }
}

ModifyUserPage.propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired,
    modifyUser: PropTypes.func.isRequired
  }

export default connect(null, {modifyUser})(ModifyUserPage)