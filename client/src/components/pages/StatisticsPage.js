import React, {Component} from 'react'
import axios from 'axios'
import {
    LineChart,
    PieChart,
    ColumnChart,
    BarChart,
    AreaChart
} from 'react-chartkick'

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
                <br />
                <LineChart
                    data={this.state.stats}
                    download={true && "stats_test"}
                />
                <br />
                <br />
                <PieChart 
                    data={this.state.stats}
                    download={true && "stats_test2"}
                />
                <br />
                <br />
                <PieChart 
                    data={this.state.stats} 
                    donut={true}
                    download={true && "stats_test3"}
                />
                <br />
                <br />
                <ColumnChart
                    data={this.state.stats} 
                    download={true && "stats_test4"}
                />
                <br />
                <br />
                <BarChart
                    data={this.state.stats} 
                    download={true && "stats_test5"}
                />
                <br />
                <br />
                <AreaChart
                    data={this.state.stats} 
                    download={true && "stats_test6"}
                />
            </div>
        )
    }

}

export default Statistics