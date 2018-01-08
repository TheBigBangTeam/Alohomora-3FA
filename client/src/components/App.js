import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import Header from './Header'
import Homepage from './Homepage'
import NotFound from './NotFound'
import Login from './Login'

const App = () => (
  <Router>
    <div>
      <Header />
      <Switch>
        <Route path='/' exact component={Homepage} />
        <Route path='/login' component={Login} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </Router>
)

export default App
