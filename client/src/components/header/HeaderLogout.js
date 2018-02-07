import React, { Component } from 'react'
import LogoutBox from 'material-ui/svg-icons/action/exit-to-app'
import { white } from 'material-ui/styles/colors'

class HeaderLogout extends Component {

  render() {
    const { styles } = this.props

    const style = {
      button: {
        marginLeft: 10,
      }
    }

    return (
      <LogoutBox color={white} style={{ ...styles, ...style.button }} />
      )
  }
}

export default HeaderLogout
