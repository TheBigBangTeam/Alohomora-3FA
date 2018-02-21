import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import InsertUserForm from '../forms/InsertUserForm'
import { insertUser } from '../../actions/insertion'

class InsertUserPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputError: ""
    }
    this.submit = this.submit.bind(this)
  }
  submit(data) {
    this.props.insertUser(data)
      .then(() => this.props.history.push('/dashboard'))
      .catch((error) =>
        this.setState({
        inputError: error.toString()
      }))
  }
  render() {
    console.log(this.state.inputError)
    return (
      <div>
        <InsertUserForm submit={this.submit} errorInput={this.state.inputError} />
      </div>
    )
  }
}

InsertUserPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  insertUser: PropTypes.func.isRequired
}

export default connect(null, { insertUser })(InsertUserPage)
