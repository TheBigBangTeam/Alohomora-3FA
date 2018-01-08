import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import Header from './Header'
import Navbar from './Navbar'
import Homepage from './Homepage'
import NotFound from './NotFound'
import Login from './Login'
import License from './License'
import Contacts from './Contacts'

const App = () => (
  <Router>
    <div>
      <Header />
      <Navbar />
      <Switch>
        <Route path='/' exact component={Homepage} />
        <Route path='/login' component={Login} />
        <Route path='/license' component={License} />
        <Route path='/contacts' component={Contacts} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </Router>
)

export default App
