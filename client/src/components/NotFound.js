import React from 'react'
import {Link} from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {Card, CardActions, CardHeader} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'

const NotFound = () => (
  <div>
    <MuiThemeProvider>
      <Card>
        <CardHeader
          titleColor='grey'
          titleStyle={{fontSize: '40px'}}
          title='Page not found :('
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

export default NotFound
