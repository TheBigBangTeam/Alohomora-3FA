import React, { Component } from 'react'
import PropTypes from 'prop-types'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { orange500 } from 'material-ui/styles/colors'

class InsertUserForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      errors: {}
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChange(e) {
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
      data: { ...this.state.data, [e.target.name]: value }
    })
  }
  handleSubmit(e) {
    e.preventDefault()
    const errors = this.validate(this.state.data)
    this.setState({ errors })
    if (Object.keys(errors).length === 0) {
      this.props.submit(this.state.data)
    }
  }
  validate(data) {
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
  render() {
    return (
      <MuiThemeProvider>
        <div style={styles.general}>
          <font face="Roboto" color="red">
            <h2>{this.props.errorInput}</h2>
          </font>
          <font face="Roboto">
            <h2>Insert a new user</h2>
          </font>
          <form>
            <TextField
              style={styles.textField}
              floatingLabelText='Name'
              errorText={this.state.errors.name}
              name='name'
              type='text'
              hintText='Enter the name'
              hintStyle={styles.hintTextColor}
              onChange={this.handleChange} />
            <br />
            <TextField
              style={styles.textField}
              floatingLabelText='Surname'
              errorText={this.state.errors.surname}
              name='surname'
              type='text'
              hintText='Enter the surname'
              hintStyle={styles.hintTextColor}
              onChange={this.handleChange} />
            <br />
            <TextField
              style={styles.textField}
              floatingLabelText='Email'
              errorText={this.state.errors.email}
              name='email'
              type='email'
              hintText='Enter the email. This must be unique'
              hintStyle={styles.hintTextColor}
              onChange={this.handleChange} />
            <br />
            <TextField
              style={styles.textField}
              floatingLabelText='Privileges'
              errorText={this.state.errors.privileges}
              name='privileges'
              type='text'
              hintText='admin logs stats'
              hintStyle={styles.hintTextColor}
              onChange={this.handleChange} />
            <br />
            <TextField
              style={styles.textField}
              floatingLabelText='Tag RFID'
              errorText={this.state.errors.rfidTag}
              name='rfidTag'
              type='text'
              hintText='A1-B2-C3-D4'
              hintStyle={styles.hintTextColor}
              onChange={this.handleChange} />
            <br />
            <TextField
              style={styles.textField}
              floatingLabelText='PIN'
              errorText={this.state.errors.pin}
              name='pin'
              type='text'
              hintText='1234'
              hintStyle={styles.hintTextColor}
              onChange={this.handleChange} />
            <br />
            <TextField
              style={styles.textField}
              floatingLabelText='Username'
              errorText={this.state.errors.username}
              name='username'
              type='text'
              hintText='Enter the username'
              hintStyle={styles.hintTextColor}
              onChange={this.handleChange} />
            <br />
            <TextField floatingLabelText='Password'
              style={styles.textField}
              errorText={this.state.errors.password}
              name='password'
              type='password'
              hintText='Minimum 8 characters required'
              hintStyle={styles.hintTextColor}
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
              label='Submit'
              onClick={this.handleSubmit} />
          </form>
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
  },
  hintTextColor: {
    color: orange500,
  }
}

InsertUserForm.propTypes = {
  submit: PropTypes.func.isRequired
}

export default InsertUserForm
