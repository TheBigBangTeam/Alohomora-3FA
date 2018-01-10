import React from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import UserRoute from '../routes/UserRoute'

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
          <Route exact path='/' component={LoginPage} />
          <UserRoute exact path='/dashboard' component={Dashboard} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  </div>
)

export default App
