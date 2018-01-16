import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import { connect } from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import Avatar from 'material-ui/Avatar'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import Menu from 'material-ui/svg-icons/navigation/menu'
import ViewModule from 'material-ui/svg-icons/action/view-module'
import HeaderButtons from './HeaderButtons'
import HeaderAvatar from './HeaderAvatar'
import AccountBox from 'material-ui/svg-icons/action/account-box'
import StatsBox from 'material-ui/svg-icons/editor/format-list-numbered'
import LogsBox from 'material-ui/svg-icons/action/pageview'
import NotificationsIcon from 'material-ui/svg-icons/social/notifications'
import MessagesIcon from 'material-ui/svg-icons/communication/message'
import {white} from 'material-ui/styles/colors'
import {deepOrange300, purple500} from 'material-ui/styles/colors'

class Header extends Component {

  render(){

    const {styles, handleChangeRequestNavDrawer} = this.props

    const style = {
      appBar: {
        position: 'fixed',
        top: 0,
        overflow: 'hidden',
      },
      menuButton: {
        marginLeft: 10
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
              <div style={style.iconsRightContainer}>
                <NotificationsIcon color={white} style={style.icons} />
                <MessagesIcon color={white} style={style.icons} />
                <HeaderAvatar />
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
    isAuthenticated: state.user.token,
    name: {
      if(state){
        state.user.user.name
      }
    },
    surname: {
      if(state){
        state.user.user.surname
      }
    },
    email: {
      if(state){
        state.user.user.email
      }
    },
    username: {
      if(state){
        state.user.user.username
      }
    }
  }
}

export default connect(mapStateToProps)(Header)
