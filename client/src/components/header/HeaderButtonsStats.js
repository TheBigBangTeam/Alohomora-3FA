import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import StatsBox from 'material-ui/svg-icons/editor/format-list-numbered'
import {white} from 'material-ui/styles/colors'

class HeaderButtonsStats extends Component {

    render() {
        const style = this.props.style
        return(
                <IconMenu color={white} style={{...style.buttonsContainer}}
                    iconButtonElement={
                    <IconButton><StatsBox color={white}/></IconButton>
                    }
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                >
                    <Link to='/statistics' style={style.link}><MenuItem key={1} primaryText="View Statistics"/></Link>
                </IconMenu>
        )
    }
}


export default HeaderButtonsStats