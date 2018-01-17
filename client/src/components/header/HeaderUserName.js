import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class HeaderUserName extends Component {

    render() {
        const name = this.props.name
        return(
            <font color="white">{name}</font>
        )
    }
}

HeaderUserName.propTypes = {
    name: PropTypes.string
}

function mapStateToProps (state) {
    return {
      name: state.user.user.name
    }
}

export default connect(mapStateToProps)(HeaderUserName)