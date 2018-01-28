import React, {Component} from 'react'
import axios from 'axios'
import {PieChart} from 'react-chartkick'

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
                />
                <br />
                <br />
                <PieChart 
                    data={this.state.stats} 
                    donut={true}
                />
            </div>
        )
    }

}

export default Statistics