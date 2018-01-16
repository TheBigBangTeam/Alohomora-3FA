import React, {Component} from 'react'
import Avatar from 'material-ui/Avatar'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class HeaderAvatar extends Component {

    render() {
        const {styles} = this.props
        const name = this.props.name

        const style = {
            avatar: {
                margintop: -12,
                marginBottom: 30
            }
        }

        return(
            <Avatar style={{...styles, ...style.avatar}} >{name[0]}</Avatar>
        )
    }
}

HeaderAvatar.propTypes = {
    styles: PropTypes.object,
    name: PropTypes.string
}

function mapStateToProps (state) {
    return {
      name: state.user.user.name
    }
}

export default connect(mapStateToProps)(HeaderAvatar)