import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import { connect } from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import Avatar from 'material-ui/Avatar'
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import Menu from 'material-ui/svg-icons/navigation/menu'
import ViewModule from 'material-ui/svg-icons/action/view-module'
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
      firstIcon: {
        marginLeft: 70,
        marginRight: 35
      },
      icons: {
        marginRight: 35
      }
    }

    return(
      <div>
        <MuiThemeProvider>
          <AppBar
            style={{...styles, ...style.appBar}}
            title={
              'Alohomora3FA'
            }
            iconElementRight={
              <div style={style.iconsRightContainer}>
                <IconMenu color={white}
                  iconButtonElement={
                    <IconButton><StatsBox color={white}/></IconButton>
                  }
                  targetOrigin={{horizontal: 'left', vertical: 'top'}}
                  anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                >
                  <MenuItem key={1} primaryText="View Statistics"/>
                </IconMenu>
                <IconMenu color={white}
                  iconButtonElement={
                    <IconButton><LogsBox color={white}/></IconButton>
                  }
                  targetOrigin={{horizontal: 'left', vertical: 'top'}}
                  anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                >
                  <MenuItem key={1} primaryText="View Logs"/>
                </IconMenu>
                <IconMenu color={white}
                  iconButtonElement={
                    <IconButton><AccountBox color={white}/></IconButton>
                  }
                  targetOrigin={{horizontal: 'left', vertical: 'top'}}
                  anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                >
                  <MenuItem key={1} primaryText="Insert User"/>
                  <MenuItem key={2} primaryText="Modify User"/>
                  <MenuItem key={3} primaryText="Eliminate user"/>
                </IconMenu>
                <NotificationsIcon color={white} style={style.firstIcon} />
                <MessagesIcon color={white} style={style.icons} />
                <IconMenu color={white}
                  iconButtonElement={
                    <IconButton>
                      <Avatar> A </Avatar>
                    </IconButton>
                  }
                  targetOrigin={{horizontal: 'right', vertical: 'top'}}
                  anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                />
              </div>
            }
          />
        </MuiThemeProvider>
      </div>
    )
  }

}

Header.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  styles: PropTypes.object,
  handleChangeRequestNavDrawer: PropTypes.func
}

function mapStateToProps (state) {
  return {
    isAuthenticated: state.user.token
  }
}

export default connect(mapStateToProps)(Header)
