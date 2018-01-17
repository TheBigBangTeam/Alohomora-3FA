import React, {Component} from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import HeaderButtonsAdmin from './HeaderButtonsAdmin'
import HeaderButtonsLogs from './HeaderButtonsLogs'
import HeaderButtonsStats from './HeaderButtonsStats'

class HeaderButtons extends Component {

    render() {
        const {styles} = this.props
        const privileges = this.props.privileges
        const style = {
            link: {
                textDecoration: 'none',
                color: '#FFF'
            }
        }
        return(
            <a>
                <Link to='/' style={{...styles, ...style.link}}>Alohomora3FA</Link>
                { privileges.includes("admin") ? <HeaderButtonsAdmin /> : 
                    privileges.includes("logs") ? <HeaderButtonsLogs /> :
                    privileges.includes("stats") ? <HeaderButtonsStats /> :
                    privileges.includes("stats") && privileges.includes("logs") ?
                    <a>
                    <HeaderButtonsStats />
                    <HeaderButtonsLogs />
                    </a>
                    :
                    <a>Case not considered</a>
                }
            </a>
        )
    }
}

HeaderButtons.propTypes = {
    styles: PropTypes.object,
    privileges: PropTypes.object,
}
function mapStateToProps (state) {
    return {
      privileges: state.user.user.privileges
    }
  }


export default connect(mapStateToProps)(HeaderButtons)