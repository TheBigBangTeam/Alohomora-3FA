import React, {Component} from 'react'
import PropTypes from 'prop-types'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

class LoginForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: {},
      loading: false,
      errors: {}
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange (e) {
    let value
    e.target.name === 'username' ? value = e.target.value.trim() : value = e.target.value
    this.setState({
      data: {...this.state.data, [e.target.name]: value}
    })
  }

  handleSubmit (e) {
    e.preventDefault()
    const errors = this.validate(this.state.data)
    this.setState({ errors })
    if (Object.keys(errors).length === 0) {
      this.props.submit(this.state.data)
    }
  }

  validate (data) {
    const errors = {}
    if (!data.username) errors.username = 'Missing username'
    if (!data.password) errors.password = 'Missing password'
    return errors
  }

  render () {
    return (
      <MuiThemeProvider>
        <div style={styles.general}>
          <form>
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
              disabled={!(!!this.state.data.username || !!this.state.data.password)}
              label='Login'
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
  }
}

LoginForm.propTypes = {
  submit: PropTypes.func.isRequired
}

export default LoginForm
