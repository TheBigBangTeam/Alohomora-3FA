import React from 'react'
import {Link} from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {Card, CardActions, CardHeader} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'

const Dashboard = () => (
  <div>
    <MuiThemeProvider>
      <Card>
        <CardHeader
          titleColor='red'
          titleStyle={{fontSize: '40px'}}
          title='Dashboard'
        />
        <CardActions>
          <Link to='/'>
            <FlatButton label='Return home' />
          </Link>
        </CardActions>
      </Card>
    </MuiThemeProvider>
  </div>
)

export default Dashboard
