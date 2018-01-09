import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'

import Header from './Header'
import Navbar from './Navbar'
import RouteSwitcher from './../routers/RouteSwitcher'

const App = () => (
  <Router>
    <div>
      <Header />
      <Navbar />
      <RouteSwitcher />
    </div>
  </Router>
)

export default App
