import React, {Component} from 'react'
import axios from 'axios'

class Logs extends Component {
    constructor (props) {
        super(props)
        this.state = {
            logs: []
        }
    }

    componentDidMount(){
        axios.get('/api/logs', {
            'headers': {
                'Authorization' : 'Bearer ' + localStorage.alohomoraToken
              }
        }).then(({data}) => {
            var array = []
            for(var i = 0; i<data.logs.length; i++) {
                array.push(data.logs[i])
            }
            this.setState({
                logs: array
            })
        })
    }

    render() {
        return(
            <div>
                <h1>Logs Page</h1>
            </div>
        )
    }

}

export default Logs