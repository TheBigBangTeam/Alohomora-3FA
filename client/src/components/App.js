import React from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import UserRoute from '../routes/UserRoute'
import GuestRoute from '../routes/GuestRoute'

import Header from './Header'
import LoginPage from './LoginPage'
import Dashboard from './Dashboard'
import NotFound from './NotFound'

const App = () => (
  <div>
    <Router>
      <div>
        <Header />
        <Switch>
          <GuestRoute exact path='/' component={LoginPage} />
          <UserRoute exact path='/dashboard' component={Dashboard} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  </div>
)

export default App
