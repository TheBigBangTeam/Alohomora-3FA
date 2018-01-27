import React, {Component} from 'react'
import axios from 'axios'
import {Card, CardMedia} from 'material-ui/Card'
import Divider from 'material-ui/Divider'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
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
                    <font face="Roboto">
                        <h2>Logs Page</h2>
                    </font>
                    <Card>
                        <CardMedia>
                            {this.state.logs.map(log =>
                            log.severity==='info' ?
                                <div>
                                    <Paper zDepth={2}>
                                    <font color="blue"><h2>{log.severity}</h2></font>
                                    <p style={{paddingLeft: 10}}>
                                        {log._id ? 
                                        <TextField
                                            disabled={false}
                                            underlineShow={false}
                                            defaultValue={"ID: "+log._id} 
                                            fullWidth={true}
                                        /> : null
                                        }
                                        <Divider />
                                        {log.user ?
                                        <TextField
                                            disabled={false}
                                            underlineShow={false}
                                            defaultValue={"User: "+log.user}
                                            fullWidth={true}
                                        /> : null
                                        }
                                        <Divider />
                                        {log.device ?
                                        <TextField
                                            disabled={false}
                                            underlineShow={false}
                                            defaultValue={"Device: "+log.device}
                                            fullWidth={true}
                                        /> : null
                                        }
                                        <Divider />
                                        {log.description ?
                                        <TextField
                                            disabled={false}
                                            underlineShow={false}
                                            defaultValue={"Description: "+log.description} 
                                            fullWidth={true}
                                        /> : null
                                        }
                                        <Divider />
                                    </p>
                                    </Paper>
                                </div>
                            :
                            log.severity==='warning' ?
                                <div>
                                    <Paper>
                                    <font color="orange"><h2>{log.severity}</h2></font>
                                    <p style={{paddingLeft: 10}}>
                                        {log._id ? 
                                        <TextField
                                            disabled={false}
                                            underlineShow={false}
                                            defaultValue={"ID: "+log._id} 
                                            fullWidth={true}
                                        /> : null
                                        }
                                        <Divider />
                                        {log.user ?
                                        <TextField
                                            disabled={false}
                                            underlineShow={false}
                                            defaultValue={"User: "+log.user}
                                            fullWidth={true}
                                        /> : null
                                        }
                                        <Divider />
                                        {log.device ?
                                        <TextField
                                            disabled={false}
                                            underlineShow={false}
                                            defaultValue={"Device: "+log.device}
                                            fullWidth={true}
                                        /> : null
                                        }
                                        <Divider />
                                        {log.description ?
                                        <TextField
                                            disabled={false}
                                            underlineShow={false}
                                            defaultValue={"Description: "+log.description} 
                                            fullWidth={true}
                                        /> : null
                                        }
                                        <Divider />
                                    </p>
                                    </Paper>
                                </div>
                            :
                            log.severity==='fatal' ?
                                <div>
                                    <Paper>
                                    <font color="red"><h1>{log.severity}</h1></font>
                                    <p style={{paddingLeft: 10}}>
                                        {log._id ? 
                                        <TextField
                                            disabled={false}
                                            underlineShow={false}
                                            defaultValue={"ID: "+log._id} 
                                            fullWidth={true}
                                        /> : null
                                        }
                                        <Divider />
                                        {log.user ?
                                        <TextField
                                            disabled={false}
                                            underlineShow={false}
                                            defaultValue={"User: "+log.user}
                                            fullWidth={true}
                                        /> : null
                                        }
                                        <Divider />
                                        {log.device ?
                                        <TextField
                                            disabled={false}
                                            underlineShow={false}
                                            defaultValue={"Device: "+log.device}
                                            fullWidth={true}
                                        /> : null
                                        }
                                        <Divider />
                                        {log.description ?
                                        <TextField
                                            disabled={false}
                                            underlineShow={false}
                                            defaultValue={"Description: "+log.description} 
                                            fullWidth={true}
                                        /> : null
                                        }
                                        <Divider />
                                    </p>
                                    </Paper>
                                </div>
                            :
                            null
                            )}
                        </CardMedia>
                    </Card>
                </div>
            </MuiThemeProvider>
        )
    }

}

export default Logs