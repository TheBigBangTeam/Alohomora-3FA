import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Header from './Header'
import Homepage from './Homepage'
import NotFound from './NotFound'

const App = () => (
  <Router>
    <div>
      <Header />
      <Switch>
        <Route exact path='/' component={Homepage} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </Router>
)

export default App
