import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import LogoutBox from 'material-ui/svg-icons/action/exit-to-app'
import { white } from 'material-ui/styles/colors'
import * as actions from '../../actions/auth'

class HeaderLogout extends Component {

  render() {
    const { styles } = this.props

    const style = {
      button: {
        marginLeft: 10,
      }
    }

    return (
      <LogoutBox color={white} style={{ ...styles, ...style.button }} onClick={() => logout()} />
      )
  }
}

Dashboard.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    isAuthenticated: !!state.user.token
  }
}

export default connect(mapStateToProps, { logout: actions.logout })(HeaderLogout)
