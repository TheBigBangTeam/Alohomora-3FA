import React from 'react'
import { connect } from 'react-redux'
import {Card, CardActions, CardHeader} from 'material-ui/Card'
import PropTypes from 'prop-types'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import FlatButton from 'material-ui/FlatButton'
import * as actions from '../actions/auth'

const Dashboard = ({logout}) => (
  <div>
    <MuiThemeProvider>
      <Card>
        <CardHeader
          titleColor='red'
          titleStyle={{fontSize: '40px'}}
          title='Dashboard'
        />
        <CardActions>
          <FlatButton onClick={() => logout()} label='Logout' /> 
        </CardActions>
      </Card>
    </MuiThemeProvider>
  </div>
)

Dashboard.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired
}

function mapStateToProps (state) {
  return {
    isAuthenticated: !!state.user.token
  }
}

export default connect(mapStateToProps, {logout: actions.logout})(Dashboard)
