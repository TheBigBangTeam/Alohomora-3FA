import React, { Component } from 'react'
import LogoutBox from 'material-ui/svg-icons/action/exit-to-app'
import { white } from 'material-ui/styles/colors'

class HeaderLogout extends Component {
  render() {
    return (
      <div>
        <LogoutBox color={white} />
      </div>
      )
  }
}

export default HeaderLogout
