import React, {Component} from 'react'
import Avatar from 'material-ui/Avatar'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import {white} from 'material-ui/styles/colors'

class HeaderAvatar extends Component {

    render() {
        const name = this.props.name
        const surname = this.props.surname
        const email = this.props.email
        const username = this.props.username

        const detailsName="Name: " + name
        const detailsSurname="Surname: " + surname
        const detailsEmail="Email: " + email
        const detailsUsername="Username: " + username

        return(
            <IconMenu color={white}
                iconButtonElement={
                <IconButton>
                    <Avatar size={33}>A</Avatar>
                </IconButton>
                }
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            >
                <MenuItem key={1} disabled={true}
                primaryText= {detailsName}
                />
                <MenuItem key={2} disabled={true}
                primaryText= {detailsSurname}
                />
                <MenuItem key={3} disabled={true}
                primaryText= {detailsEmail}
                />
                <MenuItem key={4} disabled={true}
                primaryText= {detailsUsername}
                />
            </IconMenu>
        )
    }
}

HeaderAvatar.propTypes = {
    name: PropTypes.string,
    surname: PropTypes.string,
    email: PropTypes.string,
    username: PropTypes.string,
}

function mapStateToProps (state) {
    return {
      isAuthenticated: state.user.token,
      name: state.user.user.name,
      surname: state.user.user.surname,
      email: state.user.user.email,
      username: state.user.user.username
    }
}

export default connect(mapStateToProps)(HeaderAvatar)