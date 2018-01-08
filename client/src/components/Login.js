import React, {Component} from 'react'

export default class Login extends Component {
  handleSubmit (e) {
    e.preventDefault()
    const username = e.target.elements.username.value
    const password = e.target.elements.password.value
    console.log(username)
    console.log(password)
  }

  render () {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          Username: <input type='text' name='username' />
          Password: <input type='password' name='password' />
          <button>Login</button>
        </form>
      </div>
    )
  }
}
