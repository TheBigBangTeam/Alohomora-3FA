import React, {Component} from 'react'
import PropTypes from 'prop-types'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import AccountBox from 'material-ui/svg-icons/action/account-box'
import StatsBox from 'material-ui/svg-icons/editor/format-list-numbered'
import LogsBox from 'material-ui/svg-icons/action/pageview'
import {white} from 'material-ui/styles/colors'

class HeaderButtons extends Component {

    render() {
        const {styles, handleChangeRequestNavDrawer} = this.props
        const style = {
            buttonsContainer: {
              marginLeft: 20,
              marginTop: 3.3
            },
        }
        return(
            <div>
                Alohomora3FA
                <IconMenu color={white} style={style.buttonsContainer}
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
            </div>
        )
    }
}

HeaderButtons.propTypes = {
    styles: PropTypes.object,
    handleChangeRequestNavDrawer: PropTypes.func
}

export default HeaderButtons