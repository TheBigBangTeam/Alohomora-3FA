import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import InsertUserForm from './InsertUserForm'
import {InsertUser} from '../actions/insertion'

class InsertUser extends Component {

    constructor (props) {
        super(props)
        this.submit = this.submit.bind(this)
    }
    submit (data) {
    this.props.login(data).then(() => this.props.history.push('/dashboard'))
    }

    render() {
        return(
            <div>
                <InsertUserForm submit={this.submit} />
            </div>
        )
    }

}

LoginPage.propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired,
    insertUser: PropTypes.func.isRequired
}

export default connect(null, {insertUser})(InsertUser)