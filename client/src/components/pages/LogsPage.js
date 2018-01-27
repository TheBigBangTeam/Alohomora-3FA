import React, {Component} from 'react'
import axios from 'axios'
import {Card, CardMedia} from 'material-ui/Card'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

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
            <MuiThemeProvider>
                <div>
                    <Card>
                        <CardMedia>
                            {this.state.logs.map(log =>
                            log.severity==='info' ?
                                <div>
                                    <font color="blue"><h2>{log.severity}</h2></font>
                                    <p style={{paddingLeft: 10}}>
                                        {log._id ? <font>ID: {log._id}<br /></font> : null}
                                        {log.user ? <font>User: {log.user}<br /></font> : null}
                                        {log.device ? <font>Device: {log.device}<br /></font> : null}
                                        {log.description ? <font>Description: {log.description}</font>: null}
                                    </p>
                                </div>
                            :
                            log.severity==='warning' ?
                                <div>
                                    <font color="orange"><h2>{log.severity}</h2></font>
                                    <p style={{paddingLeft: 10}}>
                                        {log._id ? <font>ID: {log._id}<br /></font> : null}
                                        {log.user ? <font>User: {log.user}<br /></font> : null}
                                        {log.device ? <font>Device: {log.device}<br /></font> : null}
                                        {log.description ? <font>Description: {log.description}</font>: null}
                                    </p>
                                </div>
                            :
                            log.severity==='fatal' ?
                                <div>
                                    <font color="red"><h1>{log.severity}</h1></font>
                                    <p style={{paddingLeft: 10}}>
                                        {log._id ? <font>ID: {log._id}<br /></font> : null}
                                        {log.user ? <font>User: {log.user}<br /></font> : null}
                                        {log.device ? <font>Device: {log.device}<br /></font> : null}
                                        {log.description ? <font>Description: {log.description}</font>: null}
                                    </p>
                                </div>
                            :
                                <div>
                                    <font>{log.severity}</font>
                                </div>
                            )}
                        </CardMedia>
                    </Card>
                </div>
            </MuiThemeProvider>
        )
    }

}

export default Logs