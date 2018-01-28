import React, {Component} from 'react'
import axios from 'axios'
import {PieChart, ColumnChart, BarChart} from 'react-chartkick'

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
                <PieChart 
                    data={this.state.stats}
                    download={true && "stats_test"}
                />
                <br />
                <br />
                <PieChart 
                    data={this.state.stats} 
                    donut={true}
                    download={true && "stats_test2"}
                />
                <ColumnChart
                    data={this.state.stats} 
                    download={true && "stats_test3"}
                />
                <BarChart
                    data={this.state.stats} 
                    download={true && "stats_test4"}
                />
            </div>
        )
    }

}

export default Statistics