import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import HeaderButtons from './HeaderButtons'
import HeaderAvatar from './HeaderAvatar'
import HeaderUserName from './HeaderUserName'
import NotificationsIcon from 'material-ui/svg-icons/social/notifications'
import MessagesIcon from 'material-ui/svg-icons/communication/message'
import {white} from 'material-ui/styles/colors'

class Header extends Component {

  render(){

    const {styles} = this.props

    const style = {
      appBar: {
        maxHeight: 57
      },
      iconsRightContainer: {
        marginLeft: 20,
        marginRight: 20
      },
      icons: {
        marginRight: 35
      },
    }

    return(
      <div>
        <MuiThemeProvider>
        {this.props.isAuthenticated ? 
        <div>
          <AppBar
            style={{...styles, ...style.appBar}}
            title={
              <HeaderButtons />
            }
            iconElementRight={
              <div style={{...styles, ...style.iconsRightContainer}}>
                <NotificationsIcon color={white} style={{...styles, ...style.icons}} />
                <MessagesIcon color={white} style={{...styles, ...style.icons}} />
                <HeaderAvatar />
                <font> </font>
                <HeaderUserName />
              </div>
            }
          />
        </div>
          :
        <div>
          <AppBar
            style={{...styles, ...style.appBar}}
            title="Alohomora3FA"
          />
        </div>}
        </MuiThemeProvider>
      </div>
    )
  }

}

Header.propTypes = {
  isAuthenticated: PropTypes.bool,
  styles: PropTypes.object,
  handleChangeRequestNavDrawer: PropTypes.func
}

function mapStateToProps (state) {
  return {
    isAuthenticated: !!state.user.token,
  }
}

export default connect(mapStateToProps)(Header)
