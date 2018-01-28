import React from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import PropTypes from 'prop-types'
import UserRoute from '../routes/UserRoute'
import GuestRoute from '../routes/GuestRoute'
import Header from './header/Header'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import Statistics from './pages/StatisticsPage'
import Logs from './pages/LogsPage'
import InsertUser from './pages/InsertUserPage'
import ModifyUser from './pages/ModifyUserPage'
import DeleteUser from './pages/DeleteUserPage'
import NotFound from './pages/NotFound'

const App = ({location}) => (
  <div>
    <Router>
      <div>
        <Header />
        <Switch>
          <GuestRoute location={location} exact path='/' component={LoginPage} />
          <UserRoute location={location} exact path='/dashboard' component={Dashboard} />
          <UserRoute location={location} exact path='/statistics' component={Statistics} />
          <UserRoute location={location} exact path='/logs' component={Logs} />
          <UserRoute location={location} exact path='/insert_user' component={InsertUser} />
          <UserRoute location={location} exact path='/modify_user' component={ModifyUser} />
          <UserRoute location={location} exact path='/delete_user' component={DeleteUser} />
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
