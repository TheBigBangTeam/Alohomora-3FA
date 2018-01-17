import React, {Component} from 'react'
import StatisticsButton from './StatisticsButton'
import LogsButton from './LogsButton'
import UsersButton from './UsersButton'

class HeaderButtonsAdmin extends Component {

    render() {
        return(
            <a>
                <StatisticsButton />
                <LogsButton />
                <UsersButton />
            </a>
        )
    }
}


export default HeaderButtonsAdmin