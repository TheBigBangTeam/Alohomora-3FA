import React from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import PropTypes from 'prop-types'
import UserRoute from '../routes/UserRoute'
import GuestRoute from '../routes/GuestRoute'

import Header from './Header'
import LoginPage from './LoginPage'
import Dashboard from './Dashboard'
import NotFound from './NotFound'

const App = ({location}) => (
  <div>
    <Router>
      <div>
        <Header />
        <Switch>
          <GuestRoute location={location} exact path='/' component={LoginPage} />
          <UserRoute location={location} exact path='/dashboard' component={Dashboard} />
          <Route location={location} component={NotFound} />
        </Switch>
      </div>
    </Router>
  </div>
)

App.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
}

export default App
