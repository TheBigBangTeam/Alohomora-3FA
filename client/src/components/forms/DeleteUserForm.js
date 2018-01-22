import React, {Component} from 'react'
import PropTypes from 'prop-types'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

class DeleteUserForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: {},
      errors: {}
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange (e) {
    let value
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
    if (!data.id) errors.username = 'Missing ID'
    return errors
  }

  render () {
    return (
      <MuiThemeProvider>
        <div style={styles.general}>
          <form>
            <TextField
              style={styles.textField}
              floatingLabelText='ID'
              errorText={this.state.errors.id}
              name='id'
              type='text'
              hintText='Enter the ID'
              onChange={this.handleChange} />
            <br />
            <RaisedButton
              primary
              style={styles.submitButton}
              type='submit'
              className='submitButton'
              disabled={!(!!this.state.data.id)}
              label='Delete'
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

DeleteUserForm.propTypes = {
  submit: PropTypes.func.isRequired
}

export default DeleteUserForm
