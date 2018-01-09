import React, {Component} from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

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
    this.setState({
      data: {...this.state.data, [e.target.name]: e.target.value}
    })
  }

  handleSubmit (e) {
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
    return (
      <div>
        <TextField floatingLabelText='Username' errorText={this.state.errors.username} name='username' type='text' hintText='Enter your username' onChange={this.handleChange} />
        <br />
        <TextField floatingLabelText='Password' errorText={this.state.errors.password} name='password' type='password' hintText='Enter your password' onChange={this.handleChange} />
        <br />
        <RaisedButton primary label='Login' onClick={this.handleSubmit} />
      </div>
    )
  }
}

export default LoginForm
