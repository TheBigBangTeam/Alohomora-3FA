import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import DeleteUserForm from '../forms/DeleteUserForm'
import {deleteUser} from '../../actions/deletion'

class DeleteUserPage extends Component {
    constructor (props) {
        super(props)
        this.submit = this.submit.bind(this)
    }

    submit (data) {
        this.props.deleteUser(data).then(() => this.props.history.push('/dashboard'))
    }

    render() {
        return(
            <div>
                <DeleteUserForm submit={this.submit} />
            </div>
        )
    }
}

DeleteUserPage.propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired,
    deleteUser: PropTypes.func.isRequired
}

export default connect(null, {deleteUser})(DeleteUserPage)