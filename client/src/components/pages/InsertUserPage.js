import React, {Component} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import InsertUserForm from '../forms/InsertUserForm'
import {insertUser} from '../../actions/insertion'

class InsertUserPage extends Component {
    constructor (props) {
        super(props)
        this.submit = this.submit.bind(this)
    }
    submit (data) {
    this.props.insertUser(data).then(() => this.props.history.push('/dashboard'))
    }
    render() {
        return(
            <div>
                <InsertUserForm submit={this.submit} />
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

export default connect(null, {insertUser})(InsertUserPage)
