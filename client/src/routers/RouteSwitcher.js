import React from 'react'
import {Route, Switch} from 'react-router-dom'

import Homepage from '../components/Homepage'
import Login from '../components/Login'
import License from '../components/License'
import Contacts from '../components/Contacts'
import EditUser from '../components/EditUser'
import NotFound from '../components/NotFound'

const RouteSwitcher = () => (
  <Switch>
    <Route path='/' exact component={Homepage} />
    <Route path='/login' component={Login} />
    <Route path='/license' component={License} />
    <Route path='/contacts' component={Contacts} />
    <Route path='/editUser/:id' component={EditUser} />
    <Route component={NotFound} />
  </Switch>
)

export default RouteSwitcher
