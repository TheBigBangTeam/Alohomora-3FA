import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Card, CardActions, CardHeader} from 'material-ui/Card'
import PropTypes from 'prop-types'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

class Dashboard extends Component {
  render() {
    return (
      <div>
        <MuiThemeProvider>
          <Card>
            <CardHeader
              titleColor='red'
              titleStyle={{ fontSize: '40px' }}
              title='Dashboard'
            />
            <CardActions>
              <h3>
                <font face="Roboto">
                  Welcome
                </font>
              </h3>
            </CardActions>
          </Card>
        </MuiThemeProvider>
      </div>
      )
  }
}

Dashboard.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
}

function mapStateToProps (state) {
  return {
    isAuthenticated: !!state.user.token
  }
}

export default connect(mapStateToProps)(Dashboard)
