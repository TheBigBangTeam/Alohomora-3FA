import React, {Component} from 'react'
import PropTypes from 'prop-types'
import StatisticsButton from './StatisticsButton'

class HeaderButtonsStats extends Component {

    render() {
        return(
            <a>
                <StatisticsButton />
            </a>
        )
    }
}

HeaderButtonsStats.propTypes = {
    styles: PropTypes.object,
}


export default HeaderButtonsStats