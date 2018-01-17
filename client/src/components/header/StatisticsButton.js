import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import StatsBox from 'material-ui/svg-icons/editor/format-list-numbered'
import {white} from 'material-ui/styles/colors'

class StatisticsButton extends Component {

    render() {
        const {styles} = this.props
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
            <a>
                <IconMenu color={white} style={{...styles, ...style.buttonsContainer}}
                    iconButtonElement={
                    <IconButton><StatsBox color={white}/></IconButton>
                    }
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                >
                    <Link to='/statistics' style={style.link}><MenuItem key={1} primaryText="View Statistics"/></Link>
                </IconMenu>
            </a>
        )
    }
}

StatisticsButton.propTypes = {
    styles: PropTypes.object,
}


export default StatisticsButton