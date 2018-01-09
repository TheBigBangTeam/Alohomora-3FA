import React from 'react'
import {Switch, Route} from 'react-router-dom'

import Header from './Header'
import LoginForm from './LoginForm'
import NotFound from './NotFound'

const App = () => (
  <div>
    <Header />
    <Switch>
      <Route exact path='/' component={LoginForm} />
      <Route component={NotFound} />
    </Switch>
  </div>
)

export default App
