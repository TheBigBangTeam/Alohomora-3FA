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
            <div>
                <Link to='/' style={{...styles, ...style.link}}>Alohomora3FA</Link>
                { privileges.includes("admin") || privileges.includes("stats") ? <HeaderButtonsStats /> : null }
                { privileges.includes("admin") || privileges.includes("logs") ? <HeaderButtonsLogs /> : null }
                { privileges.includes("admin") ? <HeaderButtonsAdmin /> : null }
            </div>
        )
    }
}

HeaderButtons.propTypes = {
    styles: PropTypes.object,
    privileges: PropTypes.array,  // This is for typechecking, check console for errors
}
function mapStateToProps (state) {
    return {
      privileges: state.user.user.privileges
    }
  }


export default connect(mapStateToProps)(HeaderButtons)