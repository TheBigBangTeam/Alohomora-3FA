import React, {Component} from 'react'
import PropTypes from 'prop-types'
import LogsButton from './LogsButton'

class HeaderButtonslogs extends Component {

    render() {
        return(
            <a>
                <LogsButton />
            </a>
        )
    }
}

HeaderButtonslogs.propTypes = {
    styles: PropTypes.object,
}


export default HeaderButtonslogs