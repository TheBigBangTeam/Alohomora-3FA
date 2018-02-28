import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import LoginForm from '../forms/LoginForm'
import { login } from '../../actions/auth'

class LoginPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputError: ""
    }
    this.submit = this.submit.bind(this)
  }
  submit(data) {
    this.props.login(data)
      .then(() => this.props.history.push('/dashboard'))
      .catch((error) =>
        this.setState({
          inputError: error.toString()
        }))
  }

  render() {
    return (
      <div>
        <LoginForm submit={this.submit} errorInput={this.state.inputError} />
      </div>
    )
  }
}

LoginPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  login: PropTypes.func.isRequired
}

export default connect(null, { login })(LoginPage)
