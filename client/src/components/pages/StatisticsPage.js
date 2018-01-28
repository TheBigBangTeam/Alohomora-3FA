import React, {Component} from 'react'
import axios from 'axios'
import { LineChart, PieChart } from 'react-chartkick'

class Statistics extends Component {

    constructor (props) {
        super(props)
        this.state = {
            stats: {}
        }
    }

    componentDidMount(){
        axios.get('/api/stats', {
            'headers': {
                'Authorization' : 'Bearer ' + localStorage.alohomoraToken
              }
        }).then(({data}) => {
            var array = JSON.stringify(data)
            this.setState({
                stats: JSON.parse(array)
            })
        })
    }

    render() {
        return(
            <div>
                <PieChart data={this.state.stats} />
            </div>
        )
    }

}

export default Statistics