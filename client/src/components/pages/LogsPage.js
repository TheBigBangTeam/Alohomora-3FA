import React, { Component } from 'react'
import axios from 'axios'
import { Card, CardMedia } from 'material-ui/Card'
import Paper from 'material-ui/Paper'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import LogsInfo from './LogsInfo'

class Logs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      logs: []
    }
  }

  componentDidMount() {
    axios.get('/api/logs', {
      'headers': {
        'Authorization': 'Bearer ' + localStorage.alohomoraToken
      }
    }).then(({ data }) => {
      var array = []
      var start = data.logs.length - 1
      var stop = data.logs.length - 10 || 0
      if (start > 0) {
        for (var i = start; i > stop; i--) {
          array.push(data.logs[i])
        }
      }
      this.setState({
        logs: array
      })
    })
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <font face="Roboto">
            <h2>Logs Page</h2>
          </font>
          <Card>
            <CardMedia>
              {this.state.logs.map(log =>
                log.severity === 'info' ?
                  <div>
                    <Paper zDepth={2}>
                      <font color="blue"><h2>{log.severity}</h2></font>
                      <p style={{ paddingLeft: 10 }}>
                        <LogsInfo
                          id={log._id}
                          user={log.user}
                          device={log.device}
                          description={log.description}
                        />
                      </p>
                    </Paper>
                  </div>
                  :
                  log.severity === 'warning' ?
                    <div>
                      <Paper>
                        <font color="orange"><h2>{log.severity}</h2></font>
                        <p style={{ paddingLeft: 10 }}>
                          <LogsInfo
                            id={log._id}
                            user={log.user}
                            device={log.device}
                            description={log.description}
                          />
                        </p>
                      </Paper>
                    </div>
                    :
                    log.severity === 'fatal' ?
                      <div>
                        <Paper>
                          <font color="red"><h1>{log.severity}</h1></font>
                          <p style={{ paddingLeft: 10 }}>
                            <LogsInfo
                              id={log._id}
                              user={log.user}
                              device={log.device}
                              description={log.description}
                            />
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
