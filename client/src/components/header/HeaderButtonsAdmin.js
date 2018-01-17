import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import AccountBox from 'material-ui/svg-icons/action/account-box'
import StatsBox from 'material-ui/svg-icons/editor/format-list-numbered'
import LogsBox from 'material-ui/svg-icons/action/pageview'
import {white} from 'material-ui/styles/colors'

class HeaderButtonsAdmin extends Component {

    render() {
        const style = {
            buttonsContainer: {
              marginLeft: 20,
            },
            link: {
                textDecoration: 'none',
                color: '#FFF'
            }
        }
        return(
                <IconMenu color={white} style={{...style.buttonsContainer}}
                    iconButtonElement={
                    <IconButton><AccountBox color={white}/></IconButton>
                    }
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                >
                    <Link to='/insert_user' style={style.link}><MenuItem key={1} primaryText="Insert User"/></Link>
                    <Link to='/modify_user' style={style.link}><MenuItem key={2} primaryText="Modify User"/></Link>
                    <Link to='/delete_user' style={style.link}><MenuItem key={3} primaryText="Eliminate user"/></Link>
                </IconMenu>
        )
    }
}


export default HeaderButtonsAdmin