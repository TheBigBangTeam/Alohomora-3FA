import React, {Component} from 'react'
import axios from 'axios'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
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
                                <p>
                                    <font color="blue">{log.severity}</font>
                                </p>
                            :
                            log.severity==='warning' ?
                                <p>
                                    <font color="orange">{log.severity}</font>
                                </p>
                            :
                            log.severity==='fatal' ?
                                <p>
                                    <font color="red">{log.severity}</font>
                                </p>
                            :
                                <p>
                                    <font>{log.severity}</font>
                                </p>
                            )}
                        </CardMedia>
                    </Card>
                </div>
            </MuiThemeProvider>
        )
    }

}

export default Logs