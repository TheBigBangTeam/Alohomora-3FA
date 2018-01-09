import React, {Component} from 'react'
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
  }

  validate (data) {
    const errors = {}
    if (!data.username) errors.username = 'Missing username'
    if (!data.password) errors.password = 'Missing password'
    return errors
  }

  render () {
    const styles = {
      general: {
        textAlign: 'center'
      },
      submitButton: {
        margin: '15px'
      }
    }

    return (
      <MuiThemeProvider>
        <div style={styles.general}>
          <form>
            <TextField
              floatingLabelText='Username'
              errorText={this.state.errors.username}
              name='username'
              type='text'
              hintText='Enter your username'
              onChange={this.handleChange} />
            <br />
            <TextField floatingLabelText='Password'
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

export default LoginForm
