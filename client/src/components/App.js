import React from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import PropTypes from 'prop-types'
import UserRoute from '../routes/UserRoute'
import GuestRoute from '../routes/GuestRoute'
import Header from './Header'
import LoginPage from './LoginPage'
import Dashboard from './Dashboard'
import Statistics from './Statistics'
import Logs from './Logs'
import InsertUser from './InsertUserPage'
import ModifyUser from './ModifyUser'
import DeleteUser from './DeleteUser'
import NotFound from './NotFound'

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
