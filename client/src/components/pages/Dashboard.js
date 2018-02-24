import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Card, CardMedia, CardHeader } from 'material-ui/Card'
import PropTypes from 'prop-types'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { LineChart } from 'react-chartkick'
import Paper from 'material-ui/Paper'
import LogsInfo from './LogsInfo'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      log: [],
      stats: {}
    }
  }

  componentDidMount() {
    //I will take the stats
    axios.get('/api/stats', {
      'headers': {
        'Authorization': 'Bearer ' + localStorage.alohomoraToken
      }
    }).then(({ data }) => {
      var array = JSON.stringify(data)
      this.setState({
        stats: JSON.parse(array)
      })
    })
    //I will take the last log
    axios.get('/api/logs', {
      'headers': {
        'Authorization': 'Bearer ' + localStorage.alohomoraToken
      }
    }).then(({ data }) => {
      var array = []
      var lastLog = data.logs.length - 1
      if (lastLog) {
        array.push(lastLog)
      }
      this.setState({
        log: array
      })
    })
  }

  render() {
    const name = this.props.name
    const surname = this.props.surname

    return (
      <div>
        <MuiThemeProvider>
          <Card>
            <CardHeader
              titleColor='red'
              titleStyle={{ fontSize: '40px' }}
              title={'Welcome back'+ " "+ name + " " + surname}
            />
            <CardMedia>
              <h3>
                <font face="Roboto">
                  
                </font>
              </h3>
            </CardMedia>
            <CardMedia>
              <font face="Roboto">
                <h2>Last Log</h2>
              </font>
              {this.state.log.map(log =>
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
            <CardMedia>
              <font face="Roboto">
                <h2>Last Statistic</h2>
              </font>
              <LineChart
                data={this.state.stats}
              />
            </CardMedia>
          </Card>
        </MuiThemeProvider>
      </div>
    )
  }
}

Dashboard.propTypes = {
  name: PropTypes.string,
  surname: PropTypes.string
}

function mapStateToProps(state) {
  return {
    name: state.user.user.name,
    surname: state.user.user.surname
  }
}

export default connect(mapStateToProps)(Dashboard)
